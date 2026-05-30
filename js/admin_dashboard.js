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

const totalClients =
document.getElementById(
    "total-clients"
);

const totalVehicles =
document.getElementById(
    "total-vehicles"
);

const pendingJobs =
document.getElementById(
    "pending-jobs"
);

const processJobs =
document.getElementById(
    "process-jobs"
);

const finishedJobs =
document.getElementById(
    "finished-jobs"
);

const recentJobs =
document.getElementById(
    "recent-jobs"
);

// =========================
// CARGAR DASHBOARD
// =========================

async function loadDashboard(){

    try{

        // =========================
        // CLIENTES
        // =========================

        const usersSnapshot =
        await getDocs(
            collection(
                db,
                "users"
            )
        );

        totalClients.textContent =
        usersSnapshot.size;

        // =========================
        // VEHÍCULOS
        // =========================

        const vehiclesSnapshot =
        await getDocs(
            collection(
                db,
                "vehicles"
            )
        );

        totalVehicles.textContent =
        vehiclesSnapshot.size;

        // =========================
        // CITAS
        // =========================

        const appointmentsSnapshot =
        await getDocs(
            collection(
                db,
                "appointments"
            )
        );

        let pending = 0;
        let process = 0;
        let finished = 0;

        let jobs = [];

        appointmentsSnapshot.forEach(
            (appointmentDoc) => {

                const appointment =
                appointmentDoc.data();

                jobs.push(
                    appointment
                );

                if(
                    appointment.status ===
                    "Pendiente"
                ){

                    pending++;

                }

                else if(
                    appointment.status ===
                    "En proceso"
                ){

                    process++;

                }

                else if(
                    appointment.status ===
                    "Terminado"
                ){

                    finished++;

                }

            }
        );

        pendingJobs.textContent =
        pending;

        processJobs.textContent =
        process;

        finishedJobs.textContent =
        finished;

        // =========================
        // ÚLTIMOS TRABAJOS
        // =========================

        recentJobs.innerHTML = "";

        jobs.sort(
            (a,b) =>
            new Date(b.date) -
            new Date(a.date)
        );

        const latestJobs =
        jobs.slice(0,5);

        if(latestJobs.length === 0){

            recentJobs.innerHTML = `

                <div class="job-card">

                    <p>
                        No hay trabajos registrados.
                    </p>

                </div>

            `;

            return;

        }

        latestJobs.forEach((job) => {

            let statusClass =
            "pending";

            if(
                job.status ===
                "En proceso"
            ){

                statusClass =
                "process";

            }

            if(
                job.status ===
                "Terminado"
            ){

                statusClass =
                "finished";

            }

            recentJobs.innerHTML += `

                <div class="job-card">

                    <h3>
                        ${job.vehicleName}
                    </h3>

                    <p>
                        Fecha:
                        ${job.date}
                    </p>

                    <p>
                        Hora:
                        ${job.time}
                    </p>

                    <p>
                        ${job.problem}
                    </p>

                    <span
                        class="status ${statusClass}"
                    >
                        ${job.status}
                    </span>

                </div>

            `;

        });

    }catch(error){

        console.error(error);

        recentJobs.innerHTML = `

            <div class="job-card">

                <p>
                    Error al cargar datos.
                </p>

            </div>

        `;

    }

}

// =========================
// INICIAR
// =========================

loadDashboard();