import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
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

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// =========================
// HTML
// =========================

const vehicleFilter =
document.getElementById(
    "vehicle-filter"
);

const historyList =
document.getElementById(
    "history-list"
);

// =========================
// CARGAR VEHÍCULOS
// =========================

async function loadVehicles(userId){

    vehicleFilter.innerHTML = `

        <option value="">
            Selecciona un vehículo
        </option>

    `;

    const q = query(
        collection(db, "vehicles"),
        where("userId", "==", userId)
    );

    const querySnapshot =
    await getDocs(q);

    querySnapshot.forEach((vehicleDoc) => {

        const vehicle =
        vehicleDoc.data();

        const vehicleId =
        vehicleDoc.id;

        vehicleFilter.innerHTML += `

            <option value="${vehicleId}">

                ${vehicle.brand}
                ${vehicle.model}
                ${vehicle.year}

            </option>

        `;

    });

}

// =========================
// CARGAR HISTORIAL
// =========================

async function loadHistory(
    userId,
    vehicleId
){

    historyList.innerHTML = "";

    const q = query(
        collection(db, "appointments"),
        where("userId", "==", userId),
        where("vehicleId", "==", vehicleId),
        where("status", "==", "Terminado")
    );

    const querySnapshot =
    await getDocs(q);

    if(querySnapshot.empty){

        historyList.innerHTML = `

            <div class="empty-history">

                No hay servicios registrados.

            </div>

        `;

        return;

    }

    querySnapshot.forEach((appointmentDoc) => {

        const appointment =
        appointmentDoc.data();

        historyList.innerHTML += `

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
                     Servicio:
                    ${appointment.problem}
                </p>

                <span class="status-finished">

                    Terminado

                </span>

            </div>

        `;

    });

}

// =========================
// SESIÓN
// =========================

onAuthStateChanged(auth, async (user) => {

    if(user){

        await loadVehicles(
            user.uid
        );

        vehicleFilter.addEventListener(
            "change",
            () => {

                const vehicleId =
                vehicleFilter.value;

                if(vehicleId){

                    loadHistory(
                        user.uid,
                        vehicleId
                    );

                }else{

                    historyList.innerHTML =
                    "";

                }

            }
        );

    }else{

        window.location.href =
        "../login.html";

    }

});