// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7mdMquCXtu_RbSZDBCuorebF43ihtCiI",
  authDomain: "ondonte-93c9c.firebaseapp.com",
  projectId: "ondonte-93c9c",
  storageBucket: "ondonte-93c9c.appspot.com",
  messagingSenderId: "874366468580",
  appId: "1:874366468580:web:97a7337e340b58a97bc7f1",
  measurementId: "G-L9S7ZB0P1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);