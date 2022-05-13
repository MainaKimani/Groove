// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getFirestore, 
    collection,
    doc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    updateDoc,
    onSnapshot,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";
import { getAuth, 
  onAuthStateChanged
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

// Initialize Firebase and servises
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

console.log ('Fetch!')


//----------------------------------------fetch from firestore--------------------------//

//limits output to desired characters
function limit (string ='', limit =0){
  return string.substring(0, limit)
}

let songs = [];

//get collection data associated to the user id
onAuthStateChanged(auth, async (user) => {
  console.log(user.uid);
  //reference Songs collection 
  const colRef = query(collection(db, 'songs'), where("user", "==", user.uid));
  
  const checkChanges = onSnapshot(colRef, (snapshot) =>{
    snapshot.docChanges().forEach((change) => {
      console.log(change)
      if (change.type === "added") {
        renderList(doc);
      }
      if (change.type === "modified") {
        renderList(doc);
      }
      if (change.type === "removed") {
        let li=songList.querySelector('[data-id =' + change.doc.id +']');
         songList.removeChild(li);
        }
    })
  })

  await getDocs(colRef)
  .then((snapshot)=>{
    snapshot.docs.forEach((doc)=>{
      renderList(doc);

      songs.push({ ...doc.data(), 
                   id: doc.id })
    })
    console.log(songs)
    const contButton =  document.getElementById("contButton");
    if (songs.length == 0){
      document.getElementById("songTitle").innerHTML = "Upload your own music";
      document.getElementById("playBanner").innerHTML = "Upload";
      document.getElementById("playBanner").classList.remove("hidden");
      document.getElementById("uploadedMusic").innerHTML = "No Music uploaded yet";
      document.getElementById("uploadedMusic").setAttribute("style", 'height:50vh');
      document.getElementById("playBanner").addEventListener('click', ()=>{ 
        window.location.href = "upload.html";
      })
    }
    else {
      document.getElementById("playBanner").innerHTML = "PLAY";
      document.getElementById("playBanner").classList.remove("hidden");
    
    var random = Math.floor(Math.random() * songs.length);
    let image = songs[random].ImageUrl;
    let title = songs[random].songName;
    let artist = songs[random].artist;
    let music = songs[random].songURL;
    //characters limited to 25
    let str = songs[random].featured;
    if (str.length > 40){
      var featured = limit(str, 40) +"...";
    } else{
      featured = str;
    }
  
    //Set top Banner
    document.getElementById("songTitle").innerHTML = title;
    if (str == ""){
      document.getElementById("artistTitle").innerHTML = artist;
    } else{
      document.getElementById("artistTitle").innerHTML = artist + " ft. " + featured;
    }
    document.getElementById("coverArtBanner").src = image;
  
    //setup masterPlay
    document.getElementById("masterPlayTitle").innerHTML = title;
    document.getElementById("masterPlayArtist").innerHTML = artist;
    document.getElementById("masterPlayArt").src = image;
    document.getElementById("currentMusic").src = music;
    }
  })
  .catch(err => {
    console.log(err)
  })

})


//Reference to the list tag on the html page
const songList = document.querySelector('#songList');

//create element and render song list
function renderList(docc){

  let li=document.createElement('li');
  li.setAttribute('data-id', docc.id);
  li.setAttribute('id', "listSong");

  const img = document.createElement('img');
  img.setAttribute('src',docc.data().ImageUrl);
  img.setAttribute("alt", 'cover art');

  const titleDiv = document.createElement('div');
  titleDiv.setAttribute('id','mysongTitle');
  titleDiv.textContent = docc.data().songName;

  const artistDiv = document.createElement('div');
  artistDiv.setAttribute('id','myartistTitle');
  if (docc.data().featured == ""){
      artistDiv.textContent= docc.data().artist;
    } else{
        artistDiv.textContent= docc.data().artist + ' ft. ' + limit( docc.data().featured, 40) +"...";;
    }
  

  const masterPlay = document.createElement('i');
  masterPlay.setAttribute('id', 'playButton');
  masterPlay.setAttribute('class', 'bi playlistPlay bi-play-circle');

  const deleteIcon = document.createElement('i');
  deleteIcon.setAttribute('id', 'deleteButton');
  deleteIcon.setAttribute('class', 'bi bi-trash3');
  deleteIcon.setAttribute('title', 'Delete Music');

  const editIcon = document.createElement('i');
  editIcon.setAttribute('id', 'editButton');
  editIcon.setAttribute('class', 'bi bi-pencil');
  editIcon.setAttribute('title', 'Edit');

 
  li.appendChild(img);
  li.appendChild(titleDiv);
  titleDiv.appendChild(artistDiv);
  li.appendChild(masterPlay);
  li.appendChild(deleteIcon);
  li.appendChild(editIcon);
  songList.appendChild(li); 


//Edit uploaded song
editIcon.addEventListener("click", async (e) => {
  console.log('Edit clicked');
  e.stopPropagation();
  let id = e.target.parentElement.getAttribute("data-id");
  

  //create the edit form
  li.setAttribute('style', 'height:200px');
  masterPlay.classList.add('hidden');
  deleteIcon.classList.add('hidden');
  editIcon.classList.add('hidden');

  const editDiv =document.createElement("li");
  editDiv.setAttribute("id",editDiv);

  const leftDiv = document.createElement("div");
  leftDiv.classList.add("leftDiv");
  const label = document.createElement("label");
  label.innerHTML = "Title: ";
  const input = document.createElement("input");
  input.setAttribute('id','editTitle');
  input.setAttribute('type','text');
  input.setAttribute('placeholder', docc.data().songName);


  const label2 = document.createElement("label");
  label2.innerHTML = "Artist: ";
  const input2 = document.createElement("input");
  input.setAttribute('id','editArtist');
  input.setAttribute('type','text');
  const label3 = document.createElement("label");
  label3.innerHTML = "Featured: ";
  const input3 = document.createElement("input");
  input.setAttribute('id','editFeatured');
  input.setAttribute('type','text');
  input.setAttribute('value','');


  const editSubmit = document.createElement('button');
  editSubmit.setAttribute('id', 'editSubmit')
  editSubmit.innerHTML = "EDIT";
  const editCancel = document.createElement('button');
  editCancel.setAttribute('id', 'editCancel');
  editCancel.innerHTML = "CANCEL";

  leftDiv.appendChild(label);
  leftDiv.appendChild(input);
  leftDiv.appendChild(label2);
  leftDiv.appendChild(input2);
  leftDiv.appendChild(label3);
  leftDiv.appendChild(input3);
  leftDiv.appendChild(editSubmit);
  leftDiv.appendChild(editCancel);
  editDiv.appendChild(leftDiv);
  li.appendChild(editDiv);


  editSubmit.addEventListener('click', async ()=>{
    if (input != '' && input2 != ''){
      const docRef = doc(db, 'songs', id);
      await updateDoc (docRef,{
        'songName': input.value,
        'artist': input2.value,
        'featured': input3.value
    })
  } 
    input.value ='';
    input2.value='';
    input3.value='';
    songs=[];
    editDiv.classList.add('hidden');
    li.setAttribute('style', 'height:80px');
    masterPlay.classList.remove('hidden');
    deleteIcon.classList.remove('hidden');
    editIcon.classList.remove('hidden');
    window.location.href = "my_music.html";
  })

  editCancel.addEventListener('click', ()=>{
    editDiv.classList.add('hidden');
    li.setAttribute('style', 'height:80px');
    masterPlay.classList.remove('hidden');
    deleteIcon.classList.remove('hidden');
    editIcon.classList.remove('hidden');
  })
})

//Delete uploaded song
deleteIcon.addEventListener("click", async (e) => {
  console.log('delete clicked');
  e.stopPropagation();
  let id = e.target.parentElement.getAttribute("data-id");
  await deleteDoc(doc(db, "songs",id));
})
//fetch data of highlighted songs and play
masterPlay.addEventListener("click", async (e) =>{
  let id = e.target.parentElement.getAttribute("data-id");
  const docRef = doc(db, "songs", id);
  const docSnap = await getDoc(docRef);
  let music = docSnap.data().songURL;
  let image = docSnap.data().ImageUrl;
  let title = docSnap.data().songName;
  let artist = docSnap.data().artist;
  let str = docSnap.data().featured;
  //characters limited to 40
  if (str.length > 30){
    var featured = limit(str, 40) +"...";
  } else{
    featured = str;
  }


  //top Banner
  document.getElementById("songTitle").innerHTML = title;
  if (str == ""){
    document.getElementById("artistTitle").innerHTML = artist;
  } else{
    document.getElementById("artistTitle").innerHTML = artist + " ft. " + featured;
  }
  //master player
  document.getElementById("coverArtBanner").src = image;
  document.getElementById("masterPlayTitle").innerHTML = title;
  document.getElementById("masterPlayArtist").innerHTML = artist;
  document.getElementById("masterPlayArt").src = image;
  document.getElementById("currentMusic").src = music;
  playMusic();
})
}

//play music from master player 
let music = document.getElementById("currentMusic");
let masterPlay = document.getElementById('masterPlay');
let wave = document.getElementsByClassName('wave')[0];

masterPlay.addEventListener('click', ()=>{ 
  playMusic();
})

document.getElementById("playBanner").addEventListener('click', ()=>{ 
  playMusic();

});

//play music funtionality 
const playMusic = function(){
  if(music.paused || music.currentTime <= 0){
    music.play();
    masterPlay.classList.remove('bi-play-circle');
    masterPlay.classList.add('bi-pause-circle');
    wave.classList.add('active2');
  } else {
    music.pause();
    masterPlay.classList.add('bi-play-circle');
    masterPlay.classList.remove('bi-pause-circle');
    wave.classList.remove('active2');
  }
}


//progress bar
let currentStart = document.getElementById('currentStart');
let currentEnd = document.getElementById('currentEnd');
let seek = document.getElementById('seek');
let bar2 = document.getElementById('bar2');
let dot = document.getElementsByClassName('dot')[0];

music.addEventListener('timeupdate', ()=>{
  let curTime = music.currentTime;
  let songDuration = music.duration;

  let min = Math.floor(songDuration / 60);
  let sec = Math.floor(songDuration % 60);
  currentEnd.innerHTML = `${min}:${sec}`;

  let curMin = Math.floor(curTime / 60);
  let cuSec = Math.floor(curTime % 60);
  currentStart.innerText = `${curMin}:${cuSec}`;

  if (music.duration >= 0){
    var progressbar = parseInt((music.currentTime/music.duration)*100);
    seek.value = progressbar;
    let seekbar = seek.value;
    bar2.style.width = `${seekbar}%`;
    dot.style.left = `${seekbar}%`;
  } else {
    var progressbar = 0;
}  
})


seek.addEventListener('change', ()=>{
  music.currentTime = seek.value * music.duration/100;
})

music.addEventListener('ended', ()=>{
  masterPlay.classList.add('bi-play-circle');
  masterPlay.classList.remove('bi-pause-circle');
  wave.classList.remove('active2');
})

//Volume functionality
let vol_icon = document.getElementById('vol_icon');
let volume = document.getElementById('volume');
let vol_dot = document.getElementById('vol_dot');
let vol_bar = document.getElementsByClassName('vol_bar')[0];

volume.addEventListener('change',()=>{
  if (volume.value==0){
    vol_icon.classList.remove('bi-volume-down');
    vol_icon.classList.add('bi-volume-mute');
    vol_icon.classList.remove('bi-volume-up');
  }
  if (volume.value > 0){
    vol_icon.classList.add('bi-volume-down');
    vol_icon.classList.remove('bi-volume-mute');
    vol_icon.classList.remove('bi-volume-up');
  }
  if (volume.value > 50){
    vol_icon.classList.remove('bi-volume-down');
    vol_icon.classList.remove('bi-volume-mute');
    vol_icon.classList.add('bi-volume-up');
  }

  let vol_a = volume.value;
  vol_bar.style.width = `${vol_a}%`;
  vol_dot.style.left = `${vol_a}%`;
  music.volume = vol_a/100;
})

//Next music
let next = document.getElementById('next');
let back = document.getElementById('back');

back.addEventListener('click', () =>{
  index -= 1;
  if (index < 1){
   
  }
})