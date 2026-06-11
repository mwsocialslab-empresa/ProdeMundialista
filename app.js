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

// Elementos del DOM principales
const authSection = document.getElementById('auth-section');
const appContent = document.getElementById('app-content');
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

// Elementos del DOM para Login y Registro
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const groupNombre = document.getElementById('group-nombre');
const authNombre = document.getElementById('auth-nombre');
const btnSubmit = document.getElementById('auth-submit-btn');
const toggleAuth = document.getElementById('toggle-auth');

// ------------------------------------------------------------------
// DICCIONARIO TRADUCTOR Y BANDERAS
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
    "Venezuela": { es: "Venezuela", flag: "ve" },
    "South Africa": { es: "Sudáfrica", flag: "za" },
    "Czechia": { es: "Rep. Checa", flag: "cz" },
    "Bosnia-Herzegovina": { es: "Bosnia", flag: "ba" },
    "Haiti": { es: "Haití", flag: "ht" },
    "Scotland": { es: "Escocia", flag: "gb-sct" },
    "Turkey": { es: "Turquía", flag: "tr" },
    "Curaçao": { es: "Curazao", flag: "cw" },
    "Ivory Coast": { es: "Costa de Marfil", flag: "ci" },
    "Sweden": { es: "Suecia", flag: "se" },
    "Cape Verde Islands": { es: "Cabo Verde", flag: "cv" },
    "Egypt": { es: "Egipto", flag: "eg" },
    "New Zealand": { es: "N. Zelanda", flag: "nz" },
    "Iraq": { es: "Irak", flag: "iq" },
    "Norway": { es: "Noruega", flag: "no" },
    "Algeria": { es: "Argelia", flag: "dz" },
    "Austria": { es: "Austria", flag: "at" },
    "Jordan": { es: "Jordania", flag: "jo" },
    "Congo DR": { es: "Congo", flag: "cd" },
    "Panama": { es: "Panamá", flag: "pa" },
    "Uzbekistan": { es: "Uzbekistán", flag: "uz" }
};

function obtenerInfoPais(nombreApi) {
    if (!nombreApi || nombreApi === "null") {
        return { nombre: "A Definir", bandera: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Placeholder_no_text.svg" };
    }
    const info = diccionarioPaises[nombreApi];
    if (info) return { nombre: info.es, bandera: `https://flagcdn.com/w80/${info.flag}.png` };
    console.log("Falta agregar al diccionario:", nombreApi);
    return { nombre: nombreApi, bandera: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Placeholder_no_text.svg" };
}

function traducirInstancia(faseApi) {
    if (!faseApi) return 'A confirmar';
    const diccionarioFases = {
        'GROUP_STAGE': 'Fase de Grupos',
        'LAST_16': 'Octavos de Final',
        'QUARTER_FINALS': 'Cuartos de Final',
        'SEMI_FINALS': 'Semifinales',
        'THIRD_PLACE': 'Tercer Puesto',
        'FINAL': 'La Gran Final'
    };
    return diccionarioFases[faseApi] || faseApi;
}

// ------------------------------------------------------------------
// AUTENTICACIÓN (LOGIN Y REGISTRO SEPARADOS)
// ------------------------------------------------------------------
let isLoginMode = true; 

if (toggleAuth) {
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode; 
        
        if (isLoginMode) {
            authTitle.innerText = "Iniciar Sesión";
            groupNombre.style.display = "none";
            authNombre.removeAttribute('required');
            btnSubmit.innerText = "Ingresar";
            toggleAuth.innerText = "¿No tienes cuenta? Regístrate aquí";
        } else {
            authTitle.innerText = "Crear Cuenta";
            groupNombre.style.display = "block";
            authNombre.setAttribute('required', 'true');
            btnSubmit.innerText = "Registrarse";
            toggleAuth.innerText = "¿Ya tienes cuenta? Ingresa aquí";
        }
    });
}

if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Efecto visual para saber que está trabajando
        const textoOriginal = btnSubmit.innerText;
        btnSubmit.innerText = "Procesando...";
        btnSubmit.disabled = true;

        const email = document.getElementById('auth-email').value.toLowerCase().trim();
        const pass = document.getElementById('auth-password').value;
        const nombre = authNombre.value.trim();

        try {
            if (isLoginMode) {
                // MODO INGRESO
                await signInWithEmailAndPassword(auth, email, pass);
            } else {
                // MODO REGISTRO
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                const user = userCredential.user;
                
                // Guardamos el apodo
                await setDoc(doc(db, "Perfiles", user.uid), {
                    nombre: nombre || "Participante",
                    email: user.email
                });
            }
            authForm.reset();
        } catch (error) {
            console.error("Error:", error);
            if (error.code === 'auth/email-already-in-use') {
                alert("Este email ya está registrado. Cambiá a la opción de 'Ingresar'.");
            } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                alert("Email o contraseña incorrectos.");
            } else if (error.code === 'auth/weak-password') {
                alert("La contraseña debe tener al menos 6 caracteres.");
            } else {
                alert("Error: " + error.message);
            }
        } finally {
            // Restauramos el botón vuelva a su estado normal
            btnSubmit.innerText = textoOriginal;
            btnSubmit.disabled = false;
        }
    });
}

btnLogout.addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
    if (user) {
        authSection.classList.add('hidden');
        appContent.classList.remove('hidden');
        
        // Verificamos el perfil por si es un usuario que ya existía antes de esta actualización
        const perfilRef = doc(db, "Perfiles", user.uid);
        const perfilSnap = await getDoc(perfilRef);
        
        if (!perfilSnap.exists()) {
            let apodo = user.email.split('@')[0]; // Fallback de seguridad
            await setDoc(perfilRef, { nombre: apodo, email: user.email });
        }

        renderFixture();
        renderRanking();
    } else {
        authSection.classList.remove('hidden');
        appContent.classList.add('hidden');
    }
});

// ------------------------------------------------------------------
// VER CONTRASEÑA (OJO)
// ------------------------------------------------------------------
document.getElementById('btn-toggle-pass')?.addEventListener('click', function() {
    const passInput = document.getElementById('auth-password'); // Actualizado al nuevo ID
    if (passInput && passInput.type === 'password') {
        passInput.type = 'text';
        this.textContent = '🙈';
    } else if (passInput) {
        passInput.type = 'password';
        this.textContent = '👁️';
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

            const diaLegible = fechaObj.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' });
            const horaLegible = fechaObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute:'2-digit' });

            if (diaLegible !== diaActual) {
                if (diaActual !== "") {
                    htmlHTML += `<button class="btn-guardar-dia" style="width: 100%; padding: 12px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 30px;">Guardar Predicciones del Día</button></div>`;
                }
                htmlHTML += `<div class="dia-grupo"><h3 style="background:#eee; padding:10px; border-radius:5px; margin-top:20px; text-transform: uppercase;">${diaLegible}</h3>`;
                diaActual = diaLegible;
            }

            const btnInfo = `<button type="button" class="btn-info" data-id="${match.id_partido}" style="background: #34495e; color: white; border: none; border-radius: 4px; padding: 4px 10px; font-size: 0.8rem; font-weight: bold; cursor: pointer; margin-left: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" title="Ver estadio y fase">🏟️ Ver Info</button>`;
            let infoEstado = `${horaLegible} hs - Estado: ${match.estado} ${btnInfo}`;
            let inputsHtml = ""; 

            if (esFinalizado) {
                infoEstado = `${horaLegible} hs - <strong style="color: #2ecc71;">FINALIZADO</strong> ${btnInfo}`;
                inputsHtml = `<div class="prediction-inputs"><span class="real-score-display">${match.goles_local}</span><span>vs</span><span class="real-score-display">${match.goles_visitante}</span></div>`;
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
                        🏟️ <strong>Sede/Lugar:</strong> ${match.venue || match.estadio || 'Sede a confirmar'} <br>
                        🏆 <strong>Instancia:</strong> ${traducirInstancia(match.stage || match.fase)}
                    </div>
                </div>
            `;
            htmlHTML += matchHtml;
        });

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
matchesContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-info')) {
        const matchId = e.target.getAttribute('data-id');
        const infoPanel = document.getElementById(`info-${matchId}`);
        if (infoPanel) infoPanel.classList.toggle('hidden'); 
        return; 
    }

    if (e.target.classList.contains('btn-guardar-dia')) {
        const user = auth.currentUser;
        if (!user) return;

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
            let rowStyle = "";
            let medalla = `<strong>${idx + 1}°</strong>`;

            if (idx === 0) {
                rowStyle = "background-color: #ffd70033; font-weight: bold;"; 
                medalla = "🥇 1°";
            } else if (idx === 1) {
                rowStyle = "background-color: #c0c0c033; font-weight: bold;"; 
                medalla = "🥈 2°";
            } else if (idx === 2) {
                rowStyle = "background-color: #cd7f3233; font-weight: bold;"; 
                medalla = "🥉 3°";
            }

            rankingTableBody.insertAdjacentHTML('beforeend', `
                <tr style="${rowStyle}">
                    <td>${medalla}</td>
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