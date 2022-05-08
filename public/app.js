// Import the functions you need from the SDKs you need
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
import { getFirestore, 
         collection, 
         doc,
         getDoc,
         addDoc,
         setDoc 
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";
import { getStorage,
         uploadBytesResumable,
         getDownloadURL,
         ref as storageRef } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

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


//-------------------------------------- Initialize Services------------------------------------------//
const db = getFirestore();
const storage = getStorage();






//play funtionality 
let masterPlay = document.getElementById('masterPlay');