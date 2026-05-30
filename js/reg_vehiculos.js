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

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// =========================
// HTML
// =========================

const form =
document.getElementById("vehicle-form");

const vehiclesContainer =
document.getElementById("vehicles-container");

// =========================
// EDITAR
// =========================

let editingVehicleId = null;

// =========================
// MOSTRAR VEHÍCULOS
// =========================

async function loadVehicles(userId){

    // LIMPIAR CONTENEDOR
    vehiclesContainer.innerHTML = "";

    // CONSULTA
    const q = query(
        collection(db, "vehicles"),
        where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    // RECORRER VEHÍCULOS
    querySnapshot.forEach((vehicleDoc) => {

        // DATOS
        const vehicle = vehicleDoc.data();

        // ID DOCUMENTO
        const vehicleId = vehicleDoc.id;

        // CREAR HTML
        vehiclesContainer.innerHTML += `

            <div class="vehicle-card">

                <h3>
                     ${vehicle.brand} ${vehicle.model}
                </h3>

                <p>
                    Año: ${vehicle.year}
                </p>

                <div class="vehicle-buttons">

                    <button
                        class="edit-btn"
                        data-id="${vehicleId}"
                        data-brand="${vehicle.brand}"
                        data-model="${vehicle.model}"
                        data-year="${vehicle.year}"
                    >
                        Editar
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${vehicleId}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        `;

    });

    // =========================
    // ELIMINAR VEHÍCULO
    // =========================

    const deleteButtons =
    document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const confirmDelete = confirm(
                "¿Eliminar vehículo?"
            );

            if(confirmDelete){

                const vehicleId =
                button.dataset.id;

                try{

                    // ELIMINAR
                    await deleteDoc(
                        doc(db, "vehicles", vehicleId)
                    );

                    // RECARGAR
                    loadVehicles(userId);

                } catch(error){

                    console.error(error);

                    alert(
                        "Error al eliminar vehículo"
                    );
                }

            }

        });

    });

    // =========================
    // EDITAR VEHÍCULO
    // =========================

    const editButtons =
    document.querySelectorAll(".edit-btn");

    editButtons.forEach((button) => {

        button.addEventListener("click", () => {

            // OBTENER DATOS
            const vehicleId =
            button.dataset.id;

            const brand =
            button.dataset.brand;

            const model =
            button.dataset.model;

            const year =
            button.dataset.year;

            // LLENAR INPUTS
            document.getElementById("brand").value =
            brand;

            document.getElementById("model").value =
            model;

            document.getElementById("year").value =
            year;

            // GUARDAR ID
            editingVehicleId = vehicleId;

            // CAMBIAR TEXTO BOTÓN
            form.querySelector("button").textContent =
            "Actualizar Vehículo";

        });

    });

}

// =========================
// VERIFICAR SESIÓN
// =========================

onAuthStateChanged(auth, (user) => {

    if(user){

        // CARGAR VEHÍCULOS
        loadVehicles(user.uid);

        // =========================
        // SUBMIT FORM
        // =========================

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

           // DATOS
const brand =
document.getElementById("brand").value.trim();

const model =
document.getElementById("model").value.trim();

const year =
parseInt(
    document.getElementById("year").value
);

// =========================
// VALIDACIONES
// =========================

// MARCA

if(brand.length < 2){

    alert(
        "Ingresa una marca válida"
    );

    return;

}

// MODELO

if(model.length < 2){

    alert(
        "Ingresa un modelo válido"
    );

    return;

}

// AÑO

const currentYear =
new Date().getFullYear();

if(
    year < 1950 ||
    year > currentYear + 1
){

    alert(
        `Ingresa un año valido ${currentYear + 1}`
    );

    return;

}

try{

                // =========================
                // ACTUALIZAR
                // =========================

                if(editingVehicleId){

                    await updateDoc(
                        doc(
                            db,
                            "vehicles",
                            editingVehicleId
                        ),
                        {
                            brand: brand,
                            model: model,
                            year: year
                        }
                    );

                    alert(
                        "Vehículo actualizado"
                    );

                    // LIMPIAR ID
                    editingVehicleId = null;

                    // CAMBIAR BOTÓN
                    form.querySelector("button").textContent =
                    "Registrar Vehículo";

                }

                // =========================
                // REGISTRAR
                // =========================

                else{

                    await addDoc(
                        collection(db, "vehicles"),
                        {
                            userId: user.uid,
                            brand: brand,
                            model: model,
                            year: year
                        }
                    );

                    alert(
                        "Vehículo registrado"
                    );

                }

                // LIMPIAR FORM
                form.reset();

                // RECARGAR
                loadVehicles(user.uid);

            } catch(error){

                console.error(error);

                alert(
                    "Error al guardar vehículo"
                );

            }

        });

    }

    // =========================
    // SIN SESIÓN
    // =========================

    else{

        window.location.href =
        "../index.html";

    }

});