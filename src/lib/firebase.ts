
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "court-companion-ecl9j",
  "appId": "1:884645790622:web:93d07e409fcd3cd2ba4c8f",
  "storageBucket": "court-companion-ecl9j.firebasestorage.app",
  "apiKey": "AIzaSyBijsqO6Ijx1zWZ923b7E2MBoVbFgTvB_Q",
  "authDomain": "court-companion-ecl9j.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "884645790622"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
