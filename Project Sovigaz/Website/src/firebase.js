// Khởi tạo Firebase SDK v9 cho Dự án Sovigaz
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sovigaz2026.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sovigaz2026",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sovigaz2026.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "701572313832",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:701572313832:web:db7692555f8f44931f4f5d"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
