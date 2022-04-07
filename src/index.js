// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, onAuthStateChanged } from "firebase/auth"

console.log ('works!')

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCc-Hoh16aNtew8CVlPACSkx9VSGT5FKiA",
    authDomain: "groove-hits.firebaseapp.com",
    projectId: "groove-hits",
    storageBucket: "groove-hits.appspot.com",
    messagingSenderId: "894366884955",
    appId: "1:894366884955:web:42c1083998d187ace90b7e"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
