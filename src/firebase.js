import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD1oC5bvXApoS9GyfimqbtJagWQ2Fi4w1o",
    authDomain: "kudretlieray.firebaseapp.com",
    projectId: "kudretlieray",
    storageBucket: "kudretlieray.firebasestorage.app",
    messagingSenderId: "1054743219731",
    appId: "1:1054743219731:web:3aed0295429d51f9f5f9e6",
    measurementId: "G-GXCYKZ71W6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, googleProvider };
