import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

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

const logoutBtn =
document.getElementById("logout-btn");

if(logoutBtn){

    logoutBtn.addEventListener("click", async () => {

        const confirmLogout = confirm(
            "¿Seguro que deseas cerrar sesión?"
        );

        if(!confirmLogout){
            return;
        }

        try{

            await signOut(auth);

            window.location.href =
            "../login.html";

        }catch(error){

            console.error(error);

            alert("Error al cerrar sesión");

        }

    });

}