// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

// Initialize Services
const db = getFirestore()

//collection reference
const colRef =  collection(db, "artists")

//get collection data - Displays the artist collection as objects in an array
getDocs (colRef)
  .then((snapshot) => {
    let artists = []
    snapshot.docs.forEach((doc) => {
      artists.push({...doc.data(), id:doc.id})
    })

    console.log(artists)
  })
  .catch(err => {
    console.log(err.message)
  })