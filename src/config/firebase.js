// Firebase configuration
// Your web app's Firebase configuration

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// You can also use environment variables for security (recommended for production)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA_O3Ja-vTSsfsERmrEwsnj37ZVCuNsTfA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "capshala.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "capshala",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "capshala.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "188690256366",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:188690256366:web:95ceee6d99d32fa9a3beff",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-5J3YB4BTKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();

// Add scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

export default app;

