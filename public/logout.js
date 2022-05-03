// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getAuth, 
         signOut
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc-Hoh16aNtew8CVlPACSkx9VSGT5FKiA",
  authDomain: "groove-hits.firebaseapp.com",
  databaseURL: "https://groove-hits-default-rtdb.firebaseio.com",
  projectId: "groove-hits",
  storageBucket: "groove-hits.appspot.com",
  messagingSenderId: "894366884955",
  appId: "1:894366884955:web:42c1083998d187ace90b7e"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize auth
const auth = getAuth();

//Logout user
const logoutBtn = document.getElementById("logout")
logoutBtn.addEventListener('click', (e)=>{
  signOut(auth)
  .then(() => {
    // Sign out  
    window.location.href = "index.html"
  })
  .catch((err) => {
    const errorCode = err.code;
    const errorMessage = err.message;
    console.log(errorMessage)
  })
})