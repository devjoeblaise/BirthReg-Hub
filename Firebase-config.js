import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "birthreg-hub.firebaseapp.com",
  projectId: "birthreg-hub",
  storageBucket: "birthreg-hub.firebasestorage.app",
  messagingSenderId: "214743933714",
  appId: "1:214743933714:web:c252c5764ba41a281a89cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();