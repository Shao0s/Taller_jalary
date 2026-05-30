import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// FIREBASE CONFIG
const firebaseConfig = {

    apiKey: "TU_API_KEY",

    authDomain: "jalary-3a129.firebaseapp.com",

    projectId: "jalary-3a129",

    storageBucket: "jalary-3a129.firebasestorage.app",

    messagingSenderId: "84153368089",

    appId: "1:84153368089:web:e12227c34463661488f488"

};

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

// VERIFICAR SESIÓN

onAuthStateChanged(auth, (user) => {

    if(!user){

        window.location.href =
        "../login.html";

    }

});