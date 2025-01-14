// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Importing Realtime Database SDK

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyByB98__5zruWxCm1U1JJ3_SuIJB9k6k9E",
    authDomain: "shhjb-code-repository.firebaseapp.com",
    projectId: "shhjb-code-repository",
    storageBucket: "shhjb-code-repository.firebasestorage.app",
    messagingSenderId: "1013990073941",
    appId: "1:1013990073941:web:642fd03488c7796c2e56dc",
    measurementId: "G-4JLWHW6225",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database with the correct URL
const db = getDatabase(app, "https://shhjb-code-repository-default-rtdb.asia-southeast1.firebasedatabase.app");

// Export db for use in other files
export { db };
