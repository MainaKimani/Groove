// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getAuth, 
    signInWithPopup,
    signInWithEmailAndPassword,
    FacebookAuthProvider,
    TwitterAuthProvider,
    GoogleAuthProvider
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

console.log("Log in!")

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize auth
const auth = getAuth();
const googleAuth = new GoogleAuthProvider();
const fbAuth = new FacebookAuthProvider();
const twitterAuth = new TwitterAuthProvider();

//Login user
const loginForm = document.getElementById("login")
loginForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  console.log('clicked')

  //Getting the input fields
  const email = loginForm.email.value 
  const password = loginForm.password.value
  

  signInWithEmailAndPassword(auth, email, password)
  .then((cred) =>{
    console.log('user logged in:' + cred.user)

    window.location.href = "play.html"
  })
  .catch((err) => {
    const errorCode = err.code;
    const errorMessage = err.message;
    console.log(errorMessage)

    if (errorMessage == 'Firebase: Error (auth/invalid-email).'){
      alert('Invalid email')
    }
    if (errorMessage == 'Firebase: Error (auth/user-not-found).'){
      alert('User not found')
    }
    
    if (errorMessage == 'Firebase: Error (auth/wrong-password).'){
      alert('Invalid password')
    }
  })
})

//login with facebook
const fbLogin = document.getElementById("fb")
fbLogin.addEventListener('click', (e)=>{
  e.preventDefault()
  console.log('fb clicked')

  const auth = getAuth();
  signInWithPopup(auth, fbAuth)
    .then((result) => {
    // The signed-in user info.
    const user = result.user;

    window.location.href = "play.html"
    console.log('user logged in:' + user)
    })
/*
    .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    console.log(errorMessage)
    console.log(credential)
*/
    .catch(function(error) {
      // An error happened.
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending Facebook credential.
        var pendingCred = error.credential;
        // The provider account's email address.
        var email = error.email;
        // Get sign-in methods for this email.
        auth.fetchSignInMethodsForEmail(email).then(function(methods) {
          // Step 3.
          // If the user has several sign-in methods,
          // the first method in the list will be the "recommended" method to use.
          if (methods[0] === 'password') {
            // Asks the user their password.
            // In real scenario, you should handle this asynchronously.
            var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
            auth.signInWithEmailAndPassword(email, password).then(function(result) {
              // Step 4a.
              return result.user.linkWithCredential(pendingCred);
            }).then(function() {
              // Facebook account successfully linked to the existing Firebase user.
              goToApp();
            });
            return;
          }
          // All the other cases are external providers.
          // Construct provider object for that provider.
          // TODO: implement getProviderForProviderId.
          var provider = getProviderForProviderId(methods[0]);
          // At this point, you should let the user know that they already have an account
          // but with a different provider, and let them validate the fact they want to
          // sign in with this provider.
          // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
          // so in real scenario you should ask the user to click on a "continue" button
          // that will trigger the signInWithPopup.
          auth.signInWithPopup(provider).then(function(result) {
            // Remember that the user may have signed in with an account that has a different email
            // address than the first one. This can happen as Firebase doesn't control the provider's
            // sign in flow and the user is free to login using whichever account they own.
            // Step 4b.
            // Link to Facebook credential.
            // As we have access to the pending credential, we can directly call the link method.
            result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function(usercred) {
              // Facebook account successfully linked to the existing Firebase user.
              goToApp();
            });
          });
        });
      }
    });

    });



//login with twitter
const twitterLogin = document.getElementById("twitter")
twitterLogin.addEventListener('click', (e)=>{
  e.preventDefault()
  console.log('twitter clicked')

  signInWithPopup(auth, twitterAuth)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    window.location.href = "play.html"
    console.log('user logged in:' + user)
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = TwitterAuthProvider.credentialFromError(error);
    // ...

    console.log(errorMessage)
    console.log(credential)
  });
})

//login with google
const googleLogin = document.getElementById("google")
googleLogin.addEventListener('click', (e)=>{
  e.preventDefault()
  console.log('google clicked')

  signInWithPopup(auth, googleAuth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...

    window.location.href = "play.html"
    console.log('user logged in:' + user)
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // 

    console.log(errorMessage)
  })
})

