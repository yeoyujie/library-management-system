// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG-YEzgY-tULflzf2jAAPn3l_oVx0k8jw",
  authDomain: "library-management-syste-ae450.firebaseapp.com",
  projectId: "library-management-syste-ae450",
  storageBucket: "library-management-syste-ae450.appspot.com",
  messagingSenderId: "722232599136",
  appId: "1:722232599136:web:68c82f4e45dae57b15d905",
  measurementId: "G-Y4GX82CPVL",
  databaseURL: "https://library-management-syste-ae450-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };