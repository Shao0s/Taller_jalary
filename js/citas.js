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

    // CONSULTA
    const q = query(
        collection(db, "vehicles"),
        where("userId", "==", userId)
    );

    const querySnapshot =
    await getDocs(q);

    querySnapshot.forEach((doc) => {

        const vehicle = doc.data();

        const vehicleId = doc.id;

        vehicleSelect.innerHTML += `

            <option value="${vehicleId}">

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

    // LIMPIAR HTML
    appointmentsContainer.innerHTML = "";

    // CONSULTA
    const q = query(
        collection(db, "appointments"),
        where("userId", "==", userId)
    );

    const querySnapshot =
    await getDocs(q);

    querySnapshot.forEach((appointmentDoc) => {

        const appointment =
        appointmentDoc.data();

        const appointmentId =
        appointmentDoc.id;

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
                    data-id="${appointmentId}"
                >

                    Cancelar

                </button>

            </div>

        `;

    });

    // =========================
    // CANCELAR CITA
    // =========================

    const cancelButtons =
    document.querySelectorAll(".cancel-btn");

    cancelButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const confirmCancel =
            confirm(
                "¿Cancelar cita?"
            );

            if(confirmCancel){

                const appointmentId =
                button.dataset.id;

                try{

                    // ELIMINAR
                    await deleteDoc(
                        doc(
                            db,
                            "appointments",
                            appointmentId
                        )
                    );

                    // MENSAJE
                    message.style.color =
                    "#4CAF50";

                    message.textContent =
                    "Cita cancelada";

                    // RECARGAR
                    loadAppointments(userId);

                } catch(error){

                    console.error(error);

                    message.style.color =
                    "#ff4d4d";

                    message.textContent =
                    "Error al cancelar cita";

                }

            }

        });

    });

}

// =========================
// VERIFICAR SESIÓN
// =========================

onAuthStateChanged(auth, (user) => {

    if(user){

        // CARGAR DATOS
        loadVehicles(user.uid);

        loadAppointments(user.uid);

        // =========================
        // REGISTRAR CITA
        // =========================

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            // LIMPIAR MENSAJE
            message.textContent = "";

            message.style.color =
            "#ff4d4d";

            // DATOS
            const vehicleId =
            document.getElementById("vehicle").value;

            const vehicleText =
            vehicleSelect.options[
                vehicleSelect.selectedIndex
            ].text;

            const date =
            document.getElementById("date").value;

            const time =
            document.getElementById("time").value;

            const problem =
            document.getElementById("problem")
            .value
            .trim();

            // =========================
            // VALIDACIONES
            // =========================

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

            // VALIDAR FIN DE SEMANA
            const selectedDate =
            new Date(date + "T00:00:00");

            const day =
            selectedDate.getDay();

            // 0 = Domingo
            // 6 = Sábado

            if(day === 0 || day === 6){

                message.textContent =
                "No hay citas disponibles sábados y domingos";

                return;
            }

            // HORARIO
            const hour =
            parseInt(time.split(":")[0]);

            if(hour < 8 || hour >= 16){

                message.textContent =
                "Horario disponible de 8 AM a 4 PM";

                return;
            }

            // SOLO LETRAS
            const lettersOnly =
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

            if(!lettersOnly.test(problem)){

                message.textContent =
                "La descripción solo debe contener letras";

                return;
            }

            // DESCRIPCIÓN MÍNIMA
            if(problem.length < 10){

                message.textContent =
                "Describe mejor el problema";

                return;
            }

            // =========================
            // VALIDAR CITAS POR HORA
            // =========================

            const appointmentQuery = query(
                collection(db, "appointments"),
                where("date", "==", date),
                where("time", "==", time)
            );

            const appointmentSnapshot =
            await getDocs(appointmentQuery);

            // MÁXIMO 2 CITAS
            if(appointmentSnapshot.size >= 2){

                message.textContent =
                "Ese horario ya alcanzó el máximo de citas";

                return;
            }

            // =========================
            // GUARDAR CITA
            // =========================

            try{

                await addDoc(
                    collection(db, "appointments"),
                    {
                        userId: user.uid,
                        vehicleId: vehicleId,
                        vehicleName: vehicleText,
                        date: date,
                        time: time,
                        problem: problem,
                        status: "Pendiente"
                    }
                );

                // ÉXITO
                message.style.color =
                "#4CAF50";

                message.textContent =
                "Cita registrada correctamente";

                // LIMPIAR
                form.reset();

                // RECARGAR
                loadAppointments(user.uid);

            } catch(error){

                console.error(error);

                message.style.color =
                "#ff4d4d";

                message.textContent =
                "Error al registrar cita";

            }

        });

    }

    // =========================
    // SIN SESIÓN
    // =========================

    else{

        window.location.href =
        "../login.html";

    }

});