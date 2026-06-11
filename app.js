// Importaciones de Firebase (Versión modular 10.x vía CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA63kXjc5_SFNeq1Bt4EPmIsHfc-oeWONU",
    authDomain: "prode-mundial-41ca7.firebaseapp.com",
    projectId: "prode-mundial-41ca7",
    storageBucket: "prode-mundial-41ca7.firebasestorage.app",
    messagingSenderId: "711913061998",
    appId: "1:711913061998:web:8876ea0b53ae6050acb07f",
    measurementId: "G-60GLTXE5ZR"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elementos del DOM
const authSection = document.getElementById('auth-section');
const appContent = document.getElementById('app-content');
const loginForm = document.getElementById('login-form');
const mainNav = document.getElementById('main-nav');
const btnFixture = document.getElementById('btn-fixture');
const btnRanking = document.getElementById('btn-ranking');
const btnLogout = document.getElementById('btn-logout');
const fixtureSection = document.getElementById('fixture-section');
const rankingSection = document.getElementById('ranking-section');
const matchesContainer = document.getElementById('matches-container');
const rankingTableBody = document.getElementById('ranking-table-body');
const btnGrupos = document.getElementById('btn-grupos');
const btnGoleadores = document.getElementById('btn-goleadores');
const gruposSection = document.getElementById('grupos-section');
const goleadoresSection = document.getElementById('goleadores-section');
const gruposContainer = document.getElementById('grupos-container');
const goleadoresContainer = document.getElementById('goleadores-container');

// ------------------------------------------------------------------
// DICCIONARIO TRADUCTOR Y BANDERAS
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// DICCIONARIO MAESTRO DE PAÍSES (Asegúrate de agregar aquí si alguno falta)
// ------------------------------------------------------------------
const diccionarioPaises = {
    "Argentina": { es: "Argentina", flag: "ar" },
    "Brazil": { es: "Brasil", flag: "br" },
    "France": { es: "Francia", flag: "fr" },
    "Germany": { es: "Alemania", flag: "de" },
    "Spain": { es: "España", flag: "es" },
    "England": { es: "Inglaterra", flag: "gb-eng" },
    "Portugal": { es: "Portugal", flag: "pt" },
    "Netherlands": { es: "Países Bajos", flag: "nl" },
    "Italy": { es: "Italia", flag: "it" },
    "Uruguay": { es: "Uruguay", flag: "uy" },
    "Colombia": { es: "Colombia", flag: "co" },
    "Chile": { es: "Chile", flag: "cl" },
    "Peru": { es: "Perú", flag: "pe" },
    "Ecuador": { es: "Ecuador", flag: "ec" },
    "Mexico": { es: "México", flag: "mx" },
    "United States": { es: "Estados Unidos", flag: "us" },
    "Canada": { es: "Canadá", flag: "ca" },
    "Japan": { es: "Japón", flag: "jp" },
    "Morocco": { es: "Marruecos", flag: "ma" },
    "Croatia": { es: "Croacia", flag: "hr" },
    "Belgium": { es: "Bélgica", flag: "be" },
    "Switzerland": { es: "Suiza", flag: "ch" },
    "Senegal": { es: "Senegal", flag: "sn" },
    "South Korea": { es: "Corea del Sur", flag: "kr" },
    "Saudi Arabia": { es: "Arabia Saudita", flag: "sa" },
    "Australia": { es: "Australia", flag: "au" },
    "Poland": { es: "Polonia", flag: "pl" },
    "Denmark": { es: "Dinamarca", flag: "dk" },
    "Serbia": { es: "Serbia", flag: "rs" },
    "Tunisia": { es: "Túnez", flag: "tn" },
    "Cameroon": { es: "Camerún", flag: "cm" },
    "Ghana": { es: "Ghana", flag: "gh" },
    "Iran": { es: "Irán", flag: "ir" },
    "Costa Rica": { es: "Costa Rica", flag: "cr" },
    "Qatar": { es: "Qatar", flag: "qa" },
    "Nigeria": { es: "Nigeria", flag: "ng" },
    "Paraguay": { es: "Paraguay", flag: "py" },
    "Bolivia": { es: "Bolivia", flag: "bo" },
    "Venezuela": { es: "Venezuela", flag: "ve" }
};

function obtenerInfoPais(nombreApi) {
    // Intentamos buscar el país en el diccionario
    const info = diccionarioPaises[nombreApi];
    
    if (info) {
        return { 
            nombre: info.es, 
            bandera: `https://flagcdn.com/w80/${info.flag}.png` 
        };
    }
    
    // SI NO LO ENCUENTRA:
    // Imprime en consola el nombre raro que llega para que sepas cuál agregar
    console.warn("País no encontrado en diccionario:", nombreApi);
    
    // Retorna el mismo nombre y una bandera genérica (placeholder)
    return { 
        nombre: nombreApi, 
        bandera: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Placeholder_no_text.svg" 
    };
}
// ------------------------------------------------------------------
// AUTENTICACIÓN LIBRE (LOGIN Y REGISTRO AUTOMÁTICO)
// ------------------------------------------------------------------

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.toLowerCase().trim();
    const password = document.getElementById('password').value;

    // Intentamos iniciar sesión primero
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            // Limpiamos los campos al entrar
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        })
        .catch((error) => {
            // Si el correo no existe en la base, creamos la cuenta automáticamente
            if(error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
                createUserWithEmailAndPassword(auth, email, password)
                    .then(() => {
                        document.getElementById('email').value = '';
                        document.getElementById('password').value = '';
                        // Opcional: un mensajito de bienvenida
                        console.log("Cuenta nueva creada exitosamente.");
                    })
                    .catch((err) => alert("Error al registrar la cuenta: " + err.message));
            } else {
                // Si la contraseña está mal u otro error
                alert("Error al acceder: " + error.message);
            }
        });
});

btnLogout.addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
    if (user) {
        authSection.classList.add('hidden');
        appContent.classList.remove('hidden');
        mainNav.classList.remove('hidden');
        
        // Control de Nombre/Apodo de pantalla
        const perfilRef = doc(db, "Perfiles", user.uid);
        const perfilSnap = await getDoc(perfilRef);
        
        if (!perfilSnap.exists()) {
            // 1. Primero intenta leer lo que el usuario escribió en el cajón de "Alias"
            let aliasInput = document.getElementById('alias')?.value.trim();
            let apodo = aliasInput;

            // 2. Si el cajón estaba vacío, lanza el cartelito
            if (!apodo || apodo === "") {
                apodo = prompt("¡Bienvenido al Prode! Ingresá tu nombre o apodo para la tabla de posiciones:");
            }
            
            // 3. Si cerró el cartel o tampoco puso nada, usa la primera parte de su email
            if (!apodo || apodo.trim() === "") {
                apodo = user.email.split('@')[0];
            }
            
            // Guarda el perfil en la base de datos
            await setDoc(perfilRef, { nombre: apodo.trim(), email: user.email });
            
            // Limpia el campo del formulario para que no quede escrito
            if (document.getElementById('alias')) document.getElementById('alias').value = '';
        }

        renderFixture();
        renderRanking();
    } else {
        authSection.classList.remove('hidden');
        appContent.classList.add('hidden');
        mainNav.classList.add('hidden');
    }
});

// ------------------------------------------------------------------
// FIXTURE CON REGLAS DE TIEMPO Y MARCADORES REALES
// ------------------------------------------------------------------

async function renderFixture() {
    const user = auth.currentUser;
    matchesContainer.innerHTML = '<p>Cargando partidos...</p>';
    
    try {
        const predSnapshot = await getDocs(collection(db, "Predicciones"));
        const misPredicciones = {};
        predSnapshot.forEach(doc => {
            const p = doc.data();
            if (p.id_usuario === user.uid) misPredicciones[p.id_partido] = p;
        });

        const querySnapshot = await getDocs(collection(db, "Partidos"));
        matchesContainer.innerHTML = '';

        const hoy = new Date();
        const limiteHabilitacion = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 2).getTime();

        const partidosArray = [];
        querySnapshot.forEach((docSnap) => partidosArray.push(docSnap.data()));
        partidosArray.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

        let diaActual = "";
        let htmlHTML = "";

        partidosArray.forEach((match) => {
            const miPred = misPredicciones[match.id_partido];
            const pLocal = miPred ? miPred.prediccion_local : "";
            const pVisitante = miPred ? miPred.prediccion_visitante : "";

            const fechaObj = new Date(match.fecha_hora);
            const ahora = Date.now();
            const horaPartido = fechaObj.getTime();
            const unMinuto = 60 * 1000;
            
            const yaEmpezo = (horaPartido - ahora) < unMinuto;
            const faltaMucho = horaPartido >= limiteHabilitacion;
            const estaBloqueado = yaEmpezo || faltaMucho;
            const esFinalizado = match.estado === "FT" || match.estado === "Finalizado" || match.estado === "FINISHED";

            // Fechas en español
            const diaLegible = fechaObj.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' });
            const horaLegible = fechaObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute:'2-digit' });

            // Lógica de separación visual por día
            if (diaLegible !== diaActual) {
                if (diaActual !== "") {
                    // Cerramos el contenedor del día anterior y agregamos su botón
                    htmlHTML += `<button class="btn-guardar-dia" style="width: 100%; padding: 12px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 30px;">Guardar Predicciones del Día</button></div>`;
                }
                // Abrimos un nuevo grupo de día
                htmlHTML += `<div class="dia-grupo"><h3 style="background:#eee; padding:10px; border-radius:5px; margin-top:20px; text-transform: uppercase;">${diaLegible}</h3>`;
                diaActual = diaLegible;
            }

            const btnInfo = `<button type="button" class="btn-info" data-id="${match.id_partido}" style="background:none; border:none; cursor:pointer; font-size:1.1rem; margin-left:10px;" title="Ver información del partido">ℹ️</button>`;
            let infoEstado = `${horaLegible} hs - Estado: ${match.estado} ${btnInfo}`;

            // SOLUCIÓN: Declaración de la variable para evitar el ReferenceError
            let inputsHtml = ""; 

            if (esFinalizado) {
                infoEstado = `${horaLegible} hs - <strong style="color: #2ecc71;">FINALIZADO</strong> ${btnInfo}`;
                inputsHtml = `
                    <div class="prediction-inputs">
                        <span class="real-score-display">${match.goles_local}</span>
                        <span>vs</span>
                        <span class="real-score-display">${match.goles_visitante}</span>
                    </div>
                `;
            } else {
                if (yaEmpezo) {
                    infoEstado = `${horaLegible} hs - <strong style="color: #e74c3c;">CERRADO (En juego)</strong> ${btnInfo}`;
                } else if (faltaMucho) {
                    infoEstado = `${horaLegible} hs - <strong style="color: #f39c12;">SE HABILITA PRÓXIMAMENTE</strong> ${btnInfo}`;
                } else {
                    infoEstado = `${horaLegible} hs - <strong style="color: #3498db;">ABIERTO</strong> ${btnInfo}`;
                }
                
                inputsHtml = `
                    <div class="prediction-inputs">
                        <input type="number" min="0" value="${pLocal}" placeholder="0" class="input-local" ${estaBloqueado ? 'disabled' : ''}>
                        <span>vs</span>
                        <input type="number" min="0" value="${pVisitante}" placeholder="0" class="input-visitante" ${estaBloqueado ? 'disabled' : ''}>
                    </div>
                `;
            }

           // Traducimos los nombres y obtenemos las banderas
            const localInfo = obtenerInfoPais(match.equipo_local);
            const visitanteInfo = obtenerInfoPais(match.equipo_visitante);

            const matchHtml = `
                <div class="match-card" data-id="${match.id_partido}">
                    <div class="match-info">${infoEstado}</div>
                    <div class="match-teams">
                        
                        <div class="team local">
                            <span class="team-name">${localInfo.nombre}</span>
                            <img src="${localInfo.bandera}" class="flag-icon" alt="Bandera">
                        </div>
                        
                        ${inputsHtml}
                        
                        <div class="team visitante">
                            <img src="${visitanteInfo.bandera}" class="flag-icon" alt="Bandera">
                            <span class="team-name">${visitanteInfo.nombre}</span>
                        </div>

                    </div>
                    ${miPred && esFinalizado ? `<div style="text-align:center; font-size:12px; margin-top:5px; color:#aaa;">Tu predicción: ${miPred.prediccion_local} - ${miPred.prediccion_visitante}</div>` : ''}
                    
                    <div id="info-${match.id_partido}" class="hidden" style="width: 100%; background: #f0f3f4; padding: 10px; margin-top: 15px; border-radius: 5px; font-size: 0.9rem; color: #2c3e50;">
                        🏟️ <strong>Sede/Estadio:</strong> ${match.estadio || 'No disponible'} <br>
                        🏆 <strong>Instancia:</strong> ${match.fase || 'Fase de Grupos'}
                    </div>
                </div>
            `;
            htmlHTML += matchHtml;
        });

        // Asegurarnos de agregar el botón al último día de la lista
        if (diaActual !== "") {
            htmlHTML += `<button class="btn-guardar-dia" style="width: 100%; padding: 12px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 30px;">Guardar Predicciones del Día</button></div>`;
        }

        matchesContainer.innerHTML = htmlHTML;
    } catch (e) {
        console.error(e);
        matchesContainer.innerHTML = '<p>Error al cargar el fixture.</p>';
    }
}

// ------------------------------------------------------------------
// GUARDAR PREDICCIONES (FILTRADO POR FECHA)
// ------------------------------------------------------------------

// Escuchamos los clics en todo el contenedor de partidos
// Escuchamos los clics en todo el contenedor de partidos
matchesContainer.addEventListener('click', async (e) => {
    
    // 1. LÓGICA PARA EL BOTÓN DE INFO (Totalmente separada)
    if (e.target.classList.contains('btn-info')) {
        const matchId = e.target.getAttribute('data-id');
        const infoPanel = document.getElementById(`info-${matchId}`);
        if (infoPanel) {
            infoPanel.classList.toggle('hidden'); // Lo muestra u oculta
        }
        return; // Cortamos acá para que no siga leyendo lo de abajo
    }

    // 2. LÓGICA PARA EL BOTÓN DE "GUARDAR DÍA"
    if (e.target.classList.contains('btn-guardar-dia')) {
        const user = auth.currentUser;
        if (!user) return;

        // Encerramos la búsqueda SOLO en el bloque del día al que le hicimos clic
        const diaGrupo = e.target.closest('.dia-grupo');
        const matchCards = diaGrupo.querySelectorAll('.match-card');
        let guardados = 0;

        try {
            const partidosSnap = await getDocs(collection(db, "Partidos"));
            const partidosData = {};
            partidosSnap.forEach(d => { partidosData[d.id] = d.data(); });

            const hoy = new Date();
            const limiteHabilitacion = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 2).getTime();

            for (const card of matchCards) {
                const matchId = card.getAttribute('data-id');
                const inputL = card.querySelector('.input-local');
                const inputV = card.querySelector('.input-visitante');

                if (!inputL || !inputV || inputL.disabled || inputV.disabled) continue; 

                const l = inputL.value;
                const v = inputV.value;

                if (l !== "" && v !== "") {
                    const matchReal = partidosData[matchId];
                    if (matchReal) {
                        const horaPartido = new Date(matchReal.fecha_hora).getTime();
                        
                        if ((horaPartido - Date.now()) < 60000 || 
                            horaPartido >= limiteHabilitacion || 
                            matchReal.estado === "FT" || 
                            matchReal.estado === "Finalizado") {
                            continue; 
                        }
                    }

                    await setDoc(doc(db, "Predicciones", `${user.uid}_${matchId}`), {
                        id_usuario: user.uid, 
                        id_partido: matchId, 
                        prediccion_local: parseInt(l), 
                        prediccion_visitante: parseInt(v)
                    });
                    guardados++;
                }
            }
            
            if (guardados > 0) {
                alert(`¡Excelente! Se guardaron ${guardados} predicciones para este día.`);
                renderFixture(); 
            } else {
                alert("No hay resultados nuevos o habilitados para guardar en este día.");
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al almacenar los datos.");
        }
    }
});

// ------------------------------------------------------------------
// MOTOR DE CÁLCULO Y TABLA DE POSICIONES EN TIEMPO REAL
// ------------------------------------------------------------------

function calcularPuntos(prediccionLocal, prediccionVisitante, resultadoLocal, resultadoVisitante) {
    if (prediccionLocal === resultadoLocal && prediccionVisitante === resultadoVisitante) return 3;
    if (Math.sign(prediccionLocal - prediccionVisitante) === Math.sign(resultadoLocal - resultadoVisitante)) return 1;
    return 0;
}

async function renderRanking() {
    rankingTableBody.innerHTML = '<tr><td colspan="3">Procesando posiciones...</td></tr>';
    try {
        const partidosSnap = await getDocs(collection(db, "Partidos"));
        const partidosReal = {};
        partidosSnap.forEach(d => {
            const m = d.data();
            if (m.estado === "FT" || m.estado === "Finalizado" || m.estado === "FINISHED") partidosReal[m.id_partido] = m;
        });

        const perfilesSnap = await getDocs(collection(db, "Perfiles"));
        const nombresUsuarios = {};
        const puntajes = {};
        perfilesSnap.forEach(d => {
            nombresUsuarios[d.id] = d.data().nombre;
            puntajes[d.id] = 0;
        });

        const prediccionesSnap = await getDocs(collection(db, "Predicciones"));
        prediccionesSnap.forEach(d => {
            const pred = d.data();
            const matchReal = partidosReal[pred.id_partido];
            if (matchReal && puntajes[pred.id_usuario] !== undefined) {
                const pts = calcularPuntos(pred.prediccion_local, pred.prediccion_visitante, matchReal.goles_local, matchReal.goles_visitante);
                puntajes[pred.id_usuario] += pts;
            }
        });

        const listaRanking = Object.keys(puntajes).map(uid => ({
            nombre: nombresUsuarios[uid] || "Participante",
            puntos: puntajes[uid]
        })).sort((a, b) => b.puntos - a.puntos);

        rankingTableBody.innerHTML = '';
        listaRanking.forEach((u, idx) => {
            rankingTableBody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><strong>${idx + 1}°</strong></td>
                    <td>${u.nombre}</td>
                    <td>${u.puntos} pts</td>
                </tr>
            `);
        });
    } catch (error) {
        console.error(error);
        rankingTableBody.innerHTML = '<tr><td colspan="3">Error al generar ranking.</td></tr>';
    }
}

// ------------------------------------------------------------------
// NAVEGACIÓN
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// PESTAÑAS Y DATOS OFICIALES (GRUPOS Y GOLEADORES)
// ------------------------------------------------------------------

function switchView(targetSection, targetButton) {
    [fixtureSection, rankingSection, gruposSection, goleadoresSection].forEach(s => {
        if(s) s.classList.add('hidden');
    });
    [btnFixture, btnRanking, btnGrupos, btnGoleadores].forEach(b => {
        if(b) b.classList.remove('active');
    });
    targetSection.classList.remove('hidden');
    targetButton.classList.add('active');
}

btnFixture.addEventListener('click', () => switchView(fixtureSection, btnFixture));
btnRanking.addEventListener('click', () => { switchView(rankingSection, btnRanking); renderRanking(); });
btnGrupos.addEventListener('click', () => { switchView(gruposSection, btnGrupos); renderGrupos(); });
btnGoleadores.addEventListener('click', () => { switchView(goleadoresSection, btnGoleadores); renderGoleadores(); });

async function renderGrupos() {
    gruposContainer.innerHTML = '<p>Cargando posiciones...</p>';
    try {
        const snap = await getDocs(collection(db, "Posiciones"));
        let html = "";
        snap.forEach(doc => {
            const data = doc.data();
            html += `<h3 style="margin-top:20px; background:#eee; padding:5px;">${data.nombre.replace('_', ' ')}</h3>
            <div class="table-responsive">
            <table>
                <tr><th>Equipo</th><th>Pts</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th></tr>
                ${data.tabla.map(t => `
                    <tr>
                        <td><img src="${t.escudo}" width="20" style="vertical-align:middle; margin-right:5px;"> ${obtenerInfoPais(t.equipo)?.nombre || t.equipo}</td>
                        <td><strong>${t.puntos}</strong></td>
                        <td>${t.pg}</td><td>${t.pe}</td><td>${t.pp}</td><td>${t.gf}</td><td>${t.gc}</td>
                    </tr>
                `).join('')}
            </table></div>`;
        });
        gruposContainer.innerHTML = html || '<p>Aún no hay datos de grupos.</p>';
    } catch (e) { console.error(e); }
}

async function renderGoleadores() {
    goleadoresContainer.innerHTML = '<p>Cargando goleadores...</p>';
    try {
        const docRef = await getDoc(doc(db, "Goleadores", "oficial"));
        if (docRef.exists()) {
            const data = docRef.data();
            let html = `<div class="table-responsive"><table>
                <tr><th>Jugador</th><th>Equipo</th><th>Goles</th></tr>
                ${data.top.map(j => `<tr>
                    <td>${j.jugador}</td>
                    <td>${obtenerInfoPais(j.equipo)?.nombre || j.equipo}</td>
                    <td><strong>${j.goles} ⚽</strong></td>
                </tr>`).join('')}
            </table></div>`;
            goleadoresContainer.innerHTML = html;
        } else {
            goleadoresContainer.innerHTML = '<p>Aún no hay goleadores registrados.</p>';
        }
    } catch (e) { console.error(e); }
}

btnFixture.addEventListener('click', () => switchView(fixtureSection, btnFixture));
btnRanking.addEventListener('click', () => { switchView(rankingSection, btnRanking); renderRanking(); });
// ------------------------------------------------------------------
// VER CONTRASEÑA (OJO)
// ------------------------------------------------------------------
document.getElementById('btn-toggle-pass')?.addEventListener('click', function() {
    const passInput = document.getElementById('password');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        this.textContent = '🙈'; // Cambia el ícono cuando se ve
    } else {
        passInput.type = 'password';
        this.textContent = '👁️'; // Vuelve al ojo normal
    }
});