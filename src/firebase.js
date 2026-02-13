import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCKiPH6nUey_D-GLRFr30mcaxFc6oHuHJM",
    authDomain: "theluxuryfocus-4b88e.firebaseapp.com",
    projectId: "theluxuryfocus-4b88e",
    storageBucket: "theluxuryfocus-4b88e.firebasestorage.app",
    messagingSenderId: "193866996368",
    appId: "1:193866996368:web:f278eb7ad843abde4c9615",
    measurementId: "G-YZ0ET43KFZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);