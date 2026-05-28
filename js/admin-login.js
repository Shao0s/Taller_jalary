import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

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

const form = document.getElementById("admin-login-form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // CORREO DEL ADMIN
        const adminEmail = "admin@jalyry.com";

        if(userCredential.user.email === adminEmail){

            window.location.href = "admin/admin_dashboard.html";

        } else {

            document.getElementById("message").textContent =
                "No tienes permisos de administrador";

        }

    } catch (error) {

        document.getElementById("message").textContent =
            "Correo o contraseña incorrectos";

        console.error(error);
    }

});