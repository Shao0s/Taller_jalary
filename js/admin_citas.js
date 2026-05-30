import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc
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

const appointmentsContainer =
document.getElementById(
    "appointments-container"
);

// =========================
// CARGAR CITAS
// =========================

async function loadAppointments(){

    appointmentsContainer.innerHTML = "";

    try{

        const querySnapshot =
        await getDocs(
            collection(
                db,
                "appointments"
            )
        );

        if(querySnapshot.empty){

            appointmentsContainer.innerHTML = `

                <div class="appointment-card">

                    <p>
                        No hay citas registradas.
                    </p>

                </div>

            `;

            return;
        }

        let activeAppointments = 0;

        querySnapshot.forEach((appointmentDoc) => {

            const appointment =
            appointmentDoc.data();

            // SOLO MOSTRAR CITAS ACTIVAS
            if(
                appointment.status ===
                "Terminado"
            ){
                return;
            }

            activeAppointments++;

            const appointmentId =
            appointmentDoc.id;

            appointmentsContainer.innerHTML += `

                <div class="appointment-card">

                    <h3>
                        ${appointment.vehicleName}
                    </h3>

                    <p>
                        Fecha: ${appointment.date}
                    </p>

                    <p>
                        Hora: ${appointment.time}
                    </p>

                    <p>
                        Problema: ${appointment.problem}
                    </p>

                    <p>
                        Estado:
                        <strong>
                            ${appointment.status}
                        </strong>
                    </p>

                    <div class="appointment-buttons">

                        <button
                            class="process-btn"
                            data-id="${appointmentId}"
                        >
                            En proceso
                        </button>

                        <button
                            class="finish-btn"
                            data-id="${appointmentId}"
                        >
                            Terminado
                        </button>

                    </div>

                </div>

            `;

        });

        // SI NO HAY CITAS ACTIVAS

        if(activeAppointments === 0){

            appointmentsContainer.innerHTML = `

                <div class="appointment-card">

                    <p>
                        No hay citas pendientes o en proceso.
                    </p>

                </div>

            `;

            return;

        }

        // =========================
        // BOTONES EN PROCESO
        // =========================

        const processButtons =
        document.querySelectorAll(
            ".process-btn"
        );

        processButtons.forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    try{

                        await updateDoc(
                            doc(
                                db,
                                "appointments",
                                button.dataset.id
                            ),
                            {
                                status:
                                "En proceso"
                            }
                        );

                        alert(
                            "Servicio en proceso"
                        );

                        loadAppointments();

                    }catch(error){

                        console.error(error);

                        alert(
                            "Error al actualizar estado"
                        );

                    }

                }
            );

        });

        // =========================
        // BOTONES TERMINADO
        // =========================

        const finishButtons =
        document.querySelectorAll(
            ".finish-btn"
        );

        finishButtons.forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const confirmar =
                    confirm(
                        "¿Marcar servicio como terminado? Esta acción no podrá deshacerse."
                    );

                    if(!confirmar){
                        return;
                    }

                    try{

                        await updateDoc(
                            doc(
                                db,
                                "appointments",
                                button.dataset.id
                            ),
                            {
                                status:
                                "Terminado"
                            }
                        );

                        alert(
                            "Servicio terminado"
                        );

                        loadAppointments();

                    }catch(error){

                        console.error(error);

                        alert(
                            "Error al actualizar"
                        );

                    }

                }
            );

        });

    }catch(error){

        console.error(error);

        appointmentsContainer.innerHTML = `

            <div class="appointment-card">

                <p>
                    Error al cargar citas.
                </p>

            </div>

        `;

    }

}

// =========================
// INICIAR
// =========================

loadAppointments();