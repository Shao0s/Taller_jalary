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
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
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

const form =
document.getElementById("appointment-form");

const vehicleSelect =
document.getElementById("vehicle");

const appointmentsContainer =
document.getElementById("appointments-container");

const message =
document.getElementById("message");

// =========================
// CARGAR VEHÍCULOS
// =========================

async function loadVehicles(userId){

    vehicleSelect.innerHTML = `
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

        vehicleSelect.innerHTML += `
            <option value="${vehicleDoc.id}">
                ${vehicle.brand}
                ${vehicle.model}
                ${vehicle.year}
            </option>
        `;

    });

}

// =========================
// MOSTRAR CITAS
// =========================

async function loadAppointments(userId){

    appointmentsContainer.innerHTML = "";

    const q = query(
        collection(db, "appointments"),
        where("userId", "==", userId)
    );

    const querySnapshot =
    await getDocs(q);

    querySnapshot.forEach((appointmentDoc) => {

        const appointment =
        appointmentDoc.data();

        // NO MOSTRAR TERMINADAS

        if(
            appointment.status ===
            "Terminado"
        ){
            return;
        }

        appointmentsContainer.innerHTML += `

            <div class="appointment-card">

                <h3>
                    ${appointment.vehicleName}
                </h3>

                <p>
                     ${appointment.date}
                </p>

                <p>
                     ${appointment.time}
                </p>

                <p>
                     ${appointment.problem}
                </p>

                <span class="status">
                    ${appointment.status}
                </span>

                <button
                    class="cancel-btn"
                    data-id="${appointmentDoc.id}"
                >
                    Cancelar
                </button>

            </div>

        `;

    });

    if(
        appointmentsContainer.innerHTML === ""
    ){

        appointmentsContainer.innerHTML = `
            <div class="appointment-card">
                <p>
                    No tienes citas activas.
                </p>
            </div>
        `;

    }

    // CANCELAR CITA

    const cancelButtons =
    document.querySelectorAll(".cancel-btn");

    cancelButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const confirmCancel =
                confirm(
                    "¿Cancelar cita?"
                );

                if(!confirmCancel){
                    return;
                }

                try{

                    await deleteDoc(
                        doc(
                            db,
                            "appointments",
                            button.dataset.id
                        )
                    );

                    message.style.color =
                    "#4CAF50";

                    message.textContent =
                    "Cita cancelada correctamente";

                    loadAppointments(userId);

                }catch(error){

                    console.error(error);

                    message.style.color =
                    "#ff4d4d";

                    message.textContent =
                    "Error al cancelar cita";

                }

            }
        );

    });

}

// =========================
// SESIÓN
// =========================

onAuthStateChanged(
    auth,
    (user) => {

        if(!user){

            window.location.href =
            "../index.html";

            return;

        }

        loadVehicles(user.uid);

        loadAppointments(user.uid);

        // =========================
        // REGISTRAR CITA
        // =========================

        form.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                message.textContent = "";

                message.style.color =
                "#ff4d4d";

                const vehicleId =
                vehicleSelect.value;

                const vehicleName =
                vehicleSelect.options[
                    vehicleSelect.selectedIndex
                ].text;

                const date =
                document.getElementById("date")
                .value;

                const time =
                document.getElementById("time")
                .value;

                const problem =
                document.getElementById("problem")
                .value
                .trim();

                // VEHÍCULO

                if(vehicleId === ""){

                    message.textContent =
                    "Selecciona un vehículo";

                    return;

                }

                // FECHA PASADA

                const today =
                new Date()
                .toISOString()
                .split("T")[0];

                if(date < today){

                    message.textContent =
                    "No puedes seleccionar fechas pasadas";

                    return;

                }

                // SÁBADO Y DOMINGO

                const selectedDate =
                new Date(date + "T00:00:00");

                const day =
                selectedDate.getDay();

                if(
                    day === 0 ||
                    day === 6
                ){

                    message.textContent =
                    "No hay citas sábados ni domingos";

                    return;

                }

                // HORARIO

                const hour =
                parseInt(
                    time.split(":")[0]
                );

                if(
                    hour < 8 ||
                    hour >= 16
                ){

                    message.textContent =
                    "Horario disponible de 8 AM a 4 PM";

                    return;

                }

                // DESCRIPCIÓN

                if(problem.length < 10){

                    message.textContent =
                    "Describe mejor el problema";

                    return;

                }

                // MÁXIMO 2 CITAS

                const appointmentQuery =
                query(
                    collection(
                        db,
                        "appointments"
                    ),
                    where(
                        "date",
                        "==",
                        date
                    ),
                    where(
                        "time",
                        "==",
                        time
                    )
                );

                const appointmentSnapshot =
                await getDocs(
                    appointmentQuery
                );

                if(
                    appointmentSnapshot.size >= 2
                ){

                    message.textContent =
                    "Ese horario ya alcanzó el máximo de citas";

                    return;

                }

                // GUARDAR

                try{

                    await addDoc(
                        collection(
                            db,
                            "appointments"
                        ),
                        {
                            userId: user.uid,
                            vehicleId: vehicleId,
                            vehicleName: vehicleName,
                            date: date,
                            time: time,
                            problem: problem,
                            status: "Pendiente"
                        }
                    );

                    message.style.color =
                    "#4CAF50";

                    message.textContent =
                    "Cita registrada correctamente";

                    form.reset();

                    loadAppointments(
                        user.uid
                    );

                }catch(error){

                    console.error(error);

                    message.style.color =
                    "#ff4d4d";

                    message.textContent =
                    "Error al registrar cita";

                }

            }
        );

    }
);