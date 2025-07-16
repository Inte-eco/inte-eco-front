import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDN1oovfjfTQaGu7OczF8X2lBBoVu4axJc",
  authDomain: "inte-eco-cd.firebaseapp.com",
  projectId: "inte-eco-cd",
  storageBucket: "inte-eco-cd.firebasestorage.app",
  messagingSenderId: "1059137775482",
  appId: "1:1059137775482:web:350fd925572439e85158c3",
  // measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de l'authentification Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage}