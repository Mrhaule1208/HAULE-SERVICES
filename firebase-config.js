// Firebase Configuration - MR. HAULE ORGANIZATION
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, push, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqpjKd-RIJKdHbIfZ6gnL1IJTok9anEMI",
  authDomain: "amani-f8133.firebaseapp.com",
  projectId: "amani-f8133",
  storageBucket: "amani-f8133.firebasestorage.app",
  messagingSenderId: "210924038305",
  appId: "1:210924038305:web:9995eaaa80d8089c2a68e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Export for use in other files
window.firebase = { app, auth, database, ref, set, get, push, query, orderByChild, equalTo };

