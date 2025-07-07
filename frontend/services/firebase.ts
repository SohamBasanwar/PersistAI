// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAybfz5Pn-QttSDXUngvXTLuS8h8hCLDow",
  authDomain: "soham-resume-builder.firebaseapp.com",
  projectId: "soham-resume-builder",
  storageBucket: "soham-resume-builder.firebasestorage.app",
  messagingSenderId: "359670948803",
  appId: "1:359670948803:web:bc6f25b129d36645a45376",
  measurementId: "G-CNRPXXGEZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// <- pure-JS auth, no native modules
const auth = getAuth(app);

// Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, signInAnonymously};