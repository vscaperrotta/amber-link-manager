// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9sUgJPMHUFs0h95Wg-oqrVZjg0H8LPDs",
  authDomain: "voidpocket-97ae7.firebaseapp.com",
  databaseURL: "https://voidpocket-97ae7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "voidpocket-97ae7",
  storageBucket: "voidpocket-97ae7.firebasestorage.app",
  messagingSenderId: "30821726892",
  appId: "1:30821726892:web:71f5ba8e91b92cb2e9bd09"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore with long-polling fallback to avoid WebChannel/service worker issues
// This helps in extension and newtab contexts where WebChannel streaming may fail.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
