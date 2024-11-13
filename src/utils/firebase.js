import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "blog-143a6.firebaseapp.com",
  projectId: "blog-143a6",
  storageBucket: "blog-143a6.firebasestorage.app",
  messagingSenderId: "764668560832",
  appId: "1:764668560832:web:8c02adca1e02acd82ef425"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);