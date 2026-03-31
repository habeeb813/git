import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1sFxrAy9DqaZzLCeqZC9wFA6TNjp7mzQ",
  authDomain: "pollster-2k26.firebaseapp.com",
  databaseURL: "https://pollster-2k26-default-rtdb.firebaseio.com",
  projectId: "pollster-2k26",
  storageBucket: "pollster-2k26.firebasestorage.app",
  messagingSenderId: "939016141952",
  appId: "1:939016141952:web:3431399036a9c79c243a65",
  measurementId: "G-W2GB3SX5V4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, analytics, app };
