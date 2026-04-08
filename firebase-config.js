// Firebase Configuration - MR. HAULE ORGANIZATION
const firebaseConfig = {
  apiKey: "AIzaSyCqpjKd-RIJKdHbIfZ6gnL1IJTok9anEMI",
  authDomain: "amani-f8133.firebaseapp.com",
  databaseURL: "https://amani-f8133-default-rtdb.firebaseio.com",
  projectId: "amani-f8133",
  storageBucket: "amani-f8133.firebasestorage.app",
  messagingSenderId: "210924038305",
  appId: "1:210924038305:web:9995eaaa80d8089c2a68e0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();