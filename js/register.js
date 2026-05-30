import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-LYurmtpKTKPzMIChDJUx37Nw1F4TljI",
    authDomain: "jalary-3a129.firebaseapp.com",
    projectId: "jalary-3a129",
    storageBucket: "jalary-3a129.firebasestorage.app",
    messagingSenderId: "84153368089",
    appId: "1:84153368089:web:e12227c34463661488f488"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

     // OBTENER DATOS
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {


    // VERIFICAR SI EL TELÉFONO YA EXISTE
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("phone", "==", phone));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            document.getElementById("message").textContent =
            "Este número ya está registrado";
            return;
        }

         // CREAR USUARIO EN AUTHENTICATION
        const userCredential =
            await createUserWithEmailAndPassword(
            
                auth,
                email,
                password
            );

        // GUARDAR DATOS EN FIRESTORE
        await addDoc(collection(db, "users"), {

            uid: userCredential.user.uid,

            name: name,

            phone: phone,

            email: email,

            createdAt: new Date()

        });

        document.getElementById("message").textContent =
            "Usuario registrado correctamente";

        setTimeout(() => {

    window.location.href = "index.html";

}, 2000);

    } catch (error) {

        if (error.code === "auth/email-already-in-use") {

            document.getElementById("message").textContent =
                "Este correo ya está registrado";

        } else if (error.code === "auth/weak-password") {

            document.getElementById("message").textContent =
                "La contraseña debe tener al menos 6 caracteres";

        } else if (error.code === "auth/invalid-email") {

            document.getElementById("message").textContent =
                "Correo inválido";

        } else {

            document.getElementById("message").textContent =
                "Error al registrar usuario";
}

        console.error(error);
    }

});