// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxdtCW4-SZZI_fwyEiYAGfcVtzovlOmP8",
  authDomain: "library-management-syste-2902d.firebaseapp.com",
  projectId: "library-management-syste-2902d",
  storageBucket: "library-management-syste-2902d.appspot.com",
  messagingSenderId: "460392849894",
  appId: "1:460392849894:web:10788c5726c76b1491b627",
  measurementId: "G-SGN7XEP9VG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app };
