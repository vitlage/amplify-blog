import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "convertic-4dbfa.firebaseapp.com",
  projectId: "convertic-4dbfa",
  storageBucket: "convertic-4dbfa.firebasestorage.app",
  messagingSenderId: "942288747158",
  appId: "1:942288747158:web:52a4e5ce4d4011297c60b7",
  measurementId: "G-SVF8YMFX1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);