import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA63kXjc5_SFNeq1Bt4EPmIsHfc-oeWONU",
    authDomain: "prode-mundial-41ca7.firebaseapp.com",
    projectId: "prode-mundial-41ca7",
    storageBucket: "prode-mundial-41ca7.firebasestorage.app",
    messagingSenderId: "711913061998",
    appId: "1:711913061998:web:8876ea0b53ae6050acb07f",
    measurementId: "G-60GLTXE5ZR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Tu nuevo token
const API_TOKEN = "fec12f4d20f14353bbe9244c3ae44a11"; 

async function sincronizarPartidos() {
    console.log("⏱️ Conectando con football-data.org...");

    try {
        // Consultamos los partidos del Mundial (WC)
        const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
            headers: { 'X-Auth-Token': API_TOKEN }
        });
        
        if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);
        
        const data = await response.json();
        console.log("📡 Escribiendo resultados reales en Firebase...");

        for (const item of data.matches) {
            const partido = {
                id_partido: item.id.toString(),
                equipo_local: item.homeTeam.name,
                equipo_visitante: item.awayTeam.name,
                fecha_hora: item.utcDate,
                estado: item.status,
                goles_local: item.score.fullTime.home ?? 0,
                goles_visitante: item.score.fullTime.away ?? 0,
                // NUEVOS DATOS QUE TRAEMOS DE LA API
                estadio: item.venue ?? "A confirmar",
                fase: item.group ?? item.stage ?? "Mundial 2026"
            };

            await setDoc(doc(db, "Partidos", partido.id_partido), partido, { merge: true });
            console.log(`✅ Sincronizado: ${partido.equipo_local} vs ${partido.equipo_visitante}`);
        }

        console.log("🚀 Sincronización finalizada exitosamente.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error durante la sincronización:", error.message);
        process.exit(1);
    }
}

async function sincronizarExtra() {
    try {
        console.log("Iniciando sincronización de Extras (Grupos y Goleadores)...");
        
        // 1. Intentar traer Posiciones de la API
        try {
            const resPos = await axios.get('http://api.football-data.org/v4/competitions/2000/standings', { headers });
            const grupos = resPos.data.standings.filter(s => s.type === 'TOTAL');
            
            for (const g of grupos) {
                await db.collection('Posiciones').doc(g.group).set({
                    nombre: g.group,
                    tabla: g.table.map(t => ({
                        equipo: t.team.name,
                        puntos: t.points,
                        pg: t.won, pe: t.draw, pp: t.lost, gf: t.goalsFor, gc: t.goalsAgainst,
                        escudo: t.team.crest
                    }))
                });
            }
        } catch (err) {
            console.log("API no disponible para grupos. Creando Grupo de Argentina por defecto...");
            // Datos de respaldo para que la pantalla no quede vacía
            await db.collection('Posiciones').doc('GROUP_A').set({
                nombre: 'GRUPO A',
                tabla: [
                    { equipo: 'Argentina', puntos: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, escudo: 'https://flagcdn.com/w80/ar.png' },
                    { equipo: 'France', puntos: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, escudo: 'https://flagcdn.com/w80/fr.png' },
                    { equipo: 'Germany', puntos: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, escudo: 'https://flagcdn.com/w80/de.png' },
                    { equipo: 'Saudi Arabia', puntos: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, escudo: 'https://flagcdn.com/w80/sa.png' }
                ]
            });
        }
        
        // 2. Intentar traer Goleadores de la API
        try {
            const resGol = await axios.get('http://api.football-data.org/v4/competitions/2000/scorers', { headers });
            const lista = resGol.data.scorers.map(s => ({
                jugador: s.player.name, equipo: s.team.name, goles: s.goals
            }));
            await db.collection('Goleadores').doc('oficial').set({ top: lista });
        } catch (err) {
            console.log("API no disponible para goleadores. Creando lista inicial...");
            // Lista de respaldo
            await db.collection('Goleadores').doc('oficial').set({
                top: [
                    { jugador: 'Lionel Messi', equipo: 'Argentina', goles: 0 },
                    { status: 'Torneo listo para iniciar' }
                ]
            });
        }
        
        console.log("¡Proceso de Extras finalizado con éxito!");
    } catch (error) {
        console.log("Error general en sincronizarExtra:", error.message);
    }
}

// No te olvides de llamar a la función al final de tu script, 
// junto a donde llamas a tu actual función de sincronizar partidos.
