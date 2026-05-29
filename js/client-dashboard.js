import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyA-LYurmtpKTKPzMIChDJUx37Nw1F4TljI",
    authDomain: "jalary-3a129.firebaseapp.com",
    projectId: "jalary-3a129",
    storageBucket: "jalary-3a129.firebasestorage.app",
    messagingSenderId: "84153368089",
    appId: "1:84153368089:web:e12227c34463661488f488"
};

// INIT
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// VERIFICAR SESIÓN
onAuthStateChanged(auth, async (user) => {

    if(user){

        // BUSCAR USUARIO EN FIRESTORE
        const q = query(
            collection(db, "users"),
            where("email", "==", user.email)
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {

            const userData = doc.data();

            console.log(userData);

            document.getElementById("welcome-message").textContent =
                `Bienvenido, ${userData.name}`;

        });

    } else {

        // SI NO HAY SESIÓN
        window.location.href = "../login.html";
    }

});

// LOGOUT
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {

    const confirmLogout = confirm(
        "¿Seguro que deseas cerrar sesión?"
    );

    if(confirmLogout){

        await signOut(auth);

        window.location.href = "../login.html";
    }

});