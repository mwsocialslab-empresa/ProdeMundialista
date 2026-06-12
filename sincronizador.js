import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  "type": "service_account",
  "project_id": "prode-mundial-41ca7",
  "private_key_id": "957148803cd2780177ec3be779bcae6864674707",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDzYMo6clyKQa6\n/PuTykeVlHVOus5gfPjigcEzsjqLqqiBZM84phPPN86zS53N3b30JqiJXs/8e1nn\nYCubTYgVFrksxRWgGOQ94kfKILrOES6g8qFAdzLjINmEUjBSNgklX20NUWoRq4eo\n0Llbe0RDXS1jWwnBkSfdJ1VzKBP0bCpVnFDB+u5/NYJmQcKj/rOcIFpGe6GuGELm\nWD0iMmLIVqkBuHCH/8cs/CKfKgxy+KTGcG+dMu+I3owIG2FnSuG3ZbVzhsN8oGEk\nmfGzGC3dQljbZ2LWiI/BBUdzPy8jSHPJEds6oAsZpIQGIFmgN9PdUMp4AKBoM0MW\nDfaThLINAgMBAAECggEACpkGgYHkid3HmU+qYY2VbKFW7MEhUh6hgpz+8zMxMQW2\neMkXNYaOVEJog9LSwpA/FkZmC91fs4I3qQAkYWkDtbnU9vk0hPBOoOeCTDc+SntV\nQ0KD+3nC0tagf1AgK8BJ+XBd9iu9v8wWxnUu+yZuWO5jpQOJ689VUYaDUlLNKwb8\nG+gXTselielT5kKjZvbcdrTLacJ+jo6RAUyFY2jgKZbEixTtnF3HGF1mfXtOoDiu\nejp8qkQ2UzYrPVS5dRgU5oUdM5X3hat8lEUTxyqfCnMpfRIsBgF5FBn8C//zwqkz\nzLL15TJ+8gQPky08fTAX6tYsK4FDJYOxcqH7M+CZoQKBgQDuODxa9PZeE8+hCSEs\nYmJW1KDJjA7U9GA3IGWbM5c+8j37pme97hI9ROTVqtZ7oDU/JQeSARJ3OBtTtx+s\n6V9dOZ1EGFY0I42Xsh9dupvI5ITvl+ROAW8g2dJpeQtVlLEq2BFnBQTrqXNwU//H\nAjoE+5hIi0uY8sMrycxtMp7WsQKBgQDSasySry3AGIg2AEofCR5YphCYTVu7jqkU\nBbt+M2Oo7tHbR6agZKNf3oE1e8fWF7lNiDmKqv2hErh7b0kJ6yKGEl5WJUdDAYe7\nnr52dZ/Z5PZuHk8HG3QfAVgGKlDtfewcpePLqAcachRoIUJP+S9F9KiwkeXUUXLP\n6PRvQERgHQKBgQCQ6mzs+DAXsv2P/TnNAlzIbbkSYr1zFuahIngtHglYJY1HVUeu\n5vD5jLuYr8CinCdILoKYc0aEeAFHwBLo4V8+GxpsnlFyjl5IdfdW0XqLj1i/WCtu\nuLidx2SU/SnD+hx878xGW2tO4Vp0buUeb2BUP6m4F+T5OlU4gh52H2E5QQKBgQCm\nxKqa32idRVQ/qH8Wlf2NOSER9M3tmyX6joiJf2VPcOi2qNUxblHmG83Ae/hogKkH\nAB7K/rbCQLoiapMy3z+fj1NhZ25RdxcC5tABxzwIUGXX5QGxmlqwcDo5uLQnZpQK\nKJigwu3OUfhGh4WtKMwE3+IK/7duTZd3nSSOQBtxKQKBgHId5t05kG5N6oSX/TBU\nPu6h/iZbW5YPTUcD6tyQUi74/3YJpCgiVz89HXMqlIOJ/2SW8N7WpbbsuMCSgjgL\nbW28HWNg85HgatZxkvoKNArNrx55dVMe58onmiL1S3J2oVW5uDr9cQiyEuDfBHLF\nr+FP6wSdlBpYUUMiqgHGGe9u\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@prode-mundial-41ca7.iam.gserviceaccount.com",
  "client_id": "116813234832352516851",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40prode-mundial-41ca7.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
const API_TOKEN = "fec12f4d20f14353bbe9244c3ae44a11"; 

async function sincronizarTodo() {
    console.log("⏱️ Iniciando sincronización en MODO DIOS con football-data.org...");
    
    try {
        const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
            headers: { 'X-Auth-Token': API_TOKEN }
        });
        
        if (!response.ok) throw new Error(`Error API Partidos ${response.status}`);
        const data = await response.json();

        for (const item of data.matches) {
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

            await db.collection("Partidos").doc(partido.id_partido).set(partido, { merge: true });
        }
        console.log("✅ Partidos sincronizados perfectamente.");
    } catch (error) { console.error("❌ Error en partidos:", error.message); }

    try {
        const resPos = await fetch('https://api.football-data.org/v4/competitions/WC/standings', {
            headers: { 'X-Auth-Token': API_TOKEN }
        });
        
        if (resPos.ok) {
            const dataPos = await resPos.json();
            const grupos = dataPos.standings.filter(s => s.type === 'TOTAL');
            
            for (const g of grupos) {
                await db.collection("Posiciones").doc(g.group).set({
                    nombre: g.group.replace('_', ' '),
                    tabla: g.table.map(t => ({
                        equipo: t.team.name, puntos: parseInt(t.points),
                        pg: parseInt(t.won), pe: parseInt(t.draw), pp: parseInt(t.lost), 
                        gf: parseInt(t.goalsFor), gc: parseInt(t.goalsAgainst),
                        escudo: t.team.crest || 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Placeholder_no_text.svg'
                    }))
                });
            }
            console.log("✅ Tablas de posiciones actualizadas.");
        }
    } catch (err) { console.error("⚠️ Falló grupos:", err.message); }

    try {
        const resGol = await fetch('https://api.football-data.org/v4/competitions/WC/scorers', {
            headers: { 'X-Auth-Token': API_TOKEN }
        });
        
        if (resGol.ok) {
            const dataGol = await resGol.json();
            const lista = dataGol.scorers.map(s => ({
                jugador: s.player.name, equipo: s.team.name, goles: parseInt(s.goals)
            }));
            await db.collection("Goleadores").doc("oficial").set({ top: lista });
            console.log("✅ Goleadores actualizados.");
        }
    } catch (err) { console.error("⚠️ Falló goleadores:", err.message); }

    console.log("🚀 Sincronización finalizada con éxito.");
    process.exit(0);
}

sincronizarTodo();
