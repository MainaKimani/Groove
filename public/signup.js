// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getAuth, 
         createUserWithEmailAndPassword 
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


console.log ('Signup!')

//signup user
const signupForm = document.getElementById("signup")
signupForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  
  //Getting the input fields
  const email = signupForm.email.value
  const password = signupForm.password.value
  const username = signupForm.username.value

  //validate input fields
  if (validate_email(email) == false) {
    alert('Please add a valid email address')
    return
    // Don't continue running the code
  }
  if (validate_password(password) == false) {
    alert('Password ought to be 6 or more characters')
    return
    // Don't continue running the code
  }
  if (validate_field(username) == false) {
    alert('Please add a username to register')
    return
  } 

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // Signed in 
      const user = cred.user;
      console.log('User created:', user); 
      signupForm.reset()

    window.location.href = "play.html"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)

      if (errorMessage == 'Firebase: Error (auth/email-already-in-use).'){
        alert('Email is already in use')
      }
      // ..
    })
})

//Validation functions
function validate_email(email) {
 const expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}
