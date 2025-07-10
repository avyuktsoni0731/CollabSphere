// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDdnAs1y9HRDBoovnekc8x7-1bBOlTgZPI",
  authDomain: "collabsphere-6c326.firebaseapp.com",
  projectId: "collabsphere-6c326",
  storageBucket: "collabsphere-6c326.firebasestorage.app",
  messagingSenderId: "902053333267",
  appId: "1:902053333267:web:febde44a8bf9d32cbc32e6",
  measurementId: "G-TWB5CNGWLQ",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
