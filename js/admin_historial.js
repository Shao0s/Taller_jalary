import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// =========================
// FIREBASE CONFIG
// =========================

const firebaseConfig = {
    apiKey: "AIzaSyA-LYurmtpKTKPzMIChDJUx37Nw1F4TljI",
    authDomain: "jalary-3a129.firebaseapp.com",
    projectId: "jalary-3a129",
    storageBucket: "jalary-3a129.firebasestorage.app",
    messagingSenderId: "84153368089",
    appId: "1:84153368089:web:e12227c34463661488f488"
};

// =========================
// INIT
// =========================

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

// =========================
// HTML
// =========================

const historyContainer =
document.getElementById(
    "history-container"
);

// =========================
// CARGAR HISTORIAL
// =========================

async function loadHistory(){

    historyContainer.innerHTML = "";

    try{

        const querySnapshot =
        await getDocs(
            collection(
                db,
                "appointments"
            )
        );

        let finishedAppointments = [];

        querySnapshot.forEach((appointmentDoc) => {

            const appointment =
            appointmentDoc.data();

            if(
                appointment.status ===
                "Terminado"
            ){

                finishedAppointments.push(
                    appointment
                );

            }

        });

        // ORDENAR POR FECHA MÁS RECIENTE

        finishedAppointments.sort(
            (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );

        // SI NO HAY SERVICIOS

        if(
            finishedAppointments.length === 0
        ){

            historyContainer.innerHTML = `

                <div class="history-card">

                    <p>
                        No hay servicios terminados.
                    </p>

                </div>

            `;

            return;

        }

        // MOSTRAR HISTORIAL

        finishedAppointments.forEach(
            (appointment) => {

                historyContainer.innerHTML += `

                    <div class="history-card">

                        <h3>
                            ${appointment.vehicleName}
                        </h3>

                        <p>
                            Fecha:
                            ${appointment.date}
                        </p>

                        <p>
                            Hora:
                            ${appointment.time}
                        </p>

                        <p>
                            Problema:
                            ${appointment.problem}
                        </p>

                        

                        <span class="completed">
                            Terminado
                        </span>

                        

                    </div>

                `;

            }
        );

    }catch(error){

        console.error(error);

        historyContainer.innerHTML = `

            <div class="history-card">

                <p>
                    Error al cargar historial.
                </p>

            </div>

        `;

    }

}

// =========================
// INICIAR
// =========================

loadHistory();