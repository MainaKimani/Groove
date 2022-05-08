// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getFirestore, 
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc 
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";

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

// Initialize Firebase and servises
const app = initializeApp(firebaseConfig);
const db = getFirestore();

console.log ('Fetch!')


//----------------------------------------fetch from firestore--------------------------//

//reference Songs collection 
const colRef = collection(db, 'songs')

let songs = [];

//get collection data
getDocs(colRef)
.then((snapshot)=>{
  snapshot.docs.forEach((doc)=>{
    renderList(doc);
    
    songs.push({ ...doc.data(), 
                 id: doc.id })
  })
  console.log(songs)

  var random = Math.floor(Math.random() * songs.length);


  //Set top Banner
  document.getElementById("songTitle").innerHTML = songs[random].songName;
  if (songs[random].featured == ""){
    document.getElementById("artistTitle").innerHTML = songs[random].artist;
  } else{
    document.getElementById("artistTitle").innerHTML = songs[random].artist + " ft. " + songs[random].featured;
  }
  
  document.getElementById("coverArtBanner").src = songs[random].ImageUrl;
})
.catch(err => {
  console.log(err)
})


//Reference to the list tag on the html page
const songList = document.querySelector('#songList');

//create element and render song list
function renderList(doc){
  let li=document.createElement('li');
  li.setAttribute('data-id', doc.id);

  const img = document.createElement('img');
  img.setAttribute('src',doc.data().ImageUrl);
  img.setAttribute("alt", 'cover art');

  const titleDiv = document.createElement('div');
  titleDiv.setAttribute('id','mysongTitle');
  titleDiv.textContent=doc.data().songName;

  const artistDiv = document.createElement('div');
  artistDiv.setAttribute('id','myartistTitle');
  if (doc.data().featured == ""){
      artistDiv.textContent= doc.data().artist;
    } else{
        artistDiv.textContent= doc.data().artist + ' ft. ' + doc.data().featured;
    }
  

  const playIcon = document.createElement('i');
  playIcon.setAttribute('id', 'playButton');
  playIcon.setAttribute('class', 'bi playlistPlay bi-play-circle');

  const deleteIcon = document.createElement('i');
  deleteIcon.setAttribute('id', 'deleteButton');
  deleteIcon.setAttribute('class', 'bi bi-trash3');

 
  li.appendChild(img);
  li.appendChild(titleDiv);
  titleDiv.appendChild(artistDiv);
  li.appendChild(playIcon);
  li.appendChild(deleteIcon);
  songList.appendChild(li); 
}


