// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "react-gym-tracker-app.firebaseapp.com",
  projectId: "react-gym-tracker-app",
  storageBucket: "react-gym-tracker-app.appspot.com",
  messagingSenderId: "766382918583",
  appId: "1:766382918583:web:1c2ddea126f8cff9ccb632",
  measurementId: "G-2Y9ZZKGG8J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore()
export const analytics = getAnalytics(app);