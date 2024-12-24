// Import the necessary modules from react-native-firebase
import { getApp, getApps, initializeApp } from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";

// Initialize Firebase App (only needed if you're not using Expo Dev Build)

// Firebase config (ensure to use the correct config from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCHdSXxK68-UkIElNijd7vgQYB4g07tYVk",
  authDomain: "peerlistclone.firebaseapp.com",
  projectId: "peerlistclone",
  storageBucket: "peerlistclone.firebasestorage.app",
  messagingSenderId: "291831572985",
  appId: "1:291831572985:web:62bee411407cae61b7f528",
  measurementId: "G-1Q5S1D7WDJ"
};

// Initialize Firebase App (this is optional with Expo Dev Build)
if (!getApps().length) {
  initializeApp(firebaseConfig);
} else {
  getApp(); // Use the existing instance
}

// Use the native Firebase SDK for auth and firestore
const db = firestore();
const authentication = auth();

export { db, authentication as auth, messaging }; // Export these for use in your app
