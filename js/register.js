import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
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

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        document.getElementById("message").textContent =
            "Usuario registrado correctamente";

    } catch (error) {

        document.getElementById("message").textContent =
            error.message;

        console.error(error);
    }

});