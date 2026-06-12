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

const API_TOKEN = "fec12f4d20f14353bbe9244c3ae44a11"; 

async function sincronizarTodo() {
    console.log("⏱️ Iniciando sincronización general con football-data.org...");
    
    // 1. SINCRONIZAR PARTIDOS
    try {
        const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
            headers: { 'X-Auth-Token': API_TOKEN }
        });
        
        if (!response.ok) throw new Error(`Error API Partidos ${response.status}`);
        const data = await response.json();

        for (const item of data.matches) {
            // Convertimos los estados de la API a los que lee tu app web
            let estadoFormateado = item.status;
            if (item.status === "FINISHED" || item.status === "FT") estadoFormateado = "Finalizado";
            if (item.status === "IN_PLAY" || item.status === "LIVE") estadoFormateado = "En juego";

            const partido = {
                id_partido: item.id.toString(),
                equipo_local: item.homeTeam.name,
                equipo_visitante: item.awayTeam.name,
                fecha_hora: item.utcDate,
                estado: estadoFormateado,
                goles_local: item.score.fullTime.home !== null ? parseInt(item.score.fullTime.home) : 0,
                goles_visitante: item.score.fullTime.away !== null ? parseInt(item.score.fullTime.away) : 0,
                estadio: item.venue || "A confirmar",
                fase: item.group || item.stage || "Mundial 2026"
            };

            await setDoc(doc(db, "Partidos", partido.id_partido), partido, { merge: true });
        }
        console.log("✅ Partidos sincronizados perfectamente.");
    } catch (error) {
        console.error("❌ Error en partidos:", error.message);
    }

    // 2. SINCRONIZAR POSICIONES DE GRUPOS
    try {
        const resPos = await fetch('https://api.football-data.org/v4/competitions/WC/standings', {
            headers: { 'X-Auth-Token': API_TOKEN }
        });
        
        if (resPos.ok) {
            const dataPos = await resPos.json();
            const grupos = dataPos.standings.filter(s => s.type === 'TOTAL');
            
            for (const g of grupos) {
                await setDoc(doc(db, "Posiciones", g.group), {
                    nombre: g.group.replace('_', ' '),
                    tabla: g.table.map(t => ({
                        equipo: t.team.name,
                        puntos: parseInt(t.points),
                        pg: parseInt(t.won), pe: parseInt(t.draw), pp: parseInt(t.lost), 
                        gf: parseInt(t.goalsFor), gc: parseInt(t.goalsAgainst),
                        escudo: t.team.crest || 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Placeholder_no_text.svg'
                    }))
                });
            }
            console.log("✅ Tablas de posiciones de grupos actualizadas.");
        }
    } catch (err) {
        console.error("⚠️ Falló la carga dinámica de grupos:", err.message);
    }

    // 3. SINCRONIZAR GOLEADORES
    try {
        const resGol = await fetch('https://api.football-data.org/v4/competitions/WC/scorers', {
            headers: { 'X-Auth-Token': API_TOKEN }
        });
        
        if (resGol.ok) {
            const dataGol = await resGol.json();
            const lista = dataGol.scorers.map(s => ({
                jugador: s.player.name, 
                equipo: s.team.name, 
                goles: parseInt(s.goals)
            }));
            await setDoc(doc(db, "Goleadores", "oficial"), { top: lista });
            console.log("✅ Tabla de goleadores actualizada.");
        }
    } catch (err) {
        console.error("⚠️ Falló la carga de goleadores oficiales:", err.message);
    }

    console.log("🚀 Sincronización finalizada con éxito.");
    process.exit(0);
}

sincronizarTodo();