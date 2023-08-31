
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBghxM2ug7eFo4OfGYszmnb3NVSxppyXYw",
    authDomain: "letsgo-75c42.firebaseapp.com",
    projectId: "letsgo-75c42",
    storageBucket: "letsgo-75c42.appspot.com",
    messagingSenderId: "416861700951",
    appId: "1:416861700951:web:84c475ce18fd8adaf5b412",
    measurementId: "G-MZ41ZG7E3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };



