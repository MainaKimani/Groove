// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getFirestore, 
    collection,
    doc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where
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


//reference Songs collection 
const colRef = collection(db, 'songs');
getDocs(colRef)
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

//Reference to the list tag on the html page
const songList = document.querySelector('#songList');
//create element and render song list
function renderList(docc){
  let li=document.createElement('li');
  li.setAttribute('data-id', docc.id);

  const img = document.createElement('img');
  img.setAttribute('src',docc.data().ImageUrl);
  img.setAttribute("alt", 'cover art');

  const titleDiv = document.createElement('div');
  titleDiv.setAttribute('id','mysongTitle');
  titleDiv.textContent=    docc.data().songName;

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
  masterPlay.setAttribute('style', 'right:50px');

  li.appendChild(img);
  li.appendChild(titleDiv);
  titleDiv.appendChild(artistDiv);
  li.appendChild(masterPlay);
  songList.appendChild(li); 


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
    document.getElementById("playBanner").innerHTML = "PAUSE";
  } else {
    music.pause();
    masterPlay.classList.add('bi-play-circle');
    masterPlay.classList.remove('bi-pause-circle');
    wave.classList.remove('active2');
    document.getElementById("playBanner").innerHTML = "PLAY";
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


let left_scroll = document.getElementById('left_scroll');
let right_scroll = document.getElementById('right_scroll');
let hit = document.getElementById('hit');

left_scroll.addEventListener('click', () =>{
  hit.scrollleft -= 330;
})
right_scroll.addEventListener('click', () =>{
  hit.scrollleft += 330;
})


//Category selection
var category;
var discover=document.getElementById('discover');
var genreOption=document.getElementById('genreOption');
var genreOptions1 = document.getElementById('genreOptions1');
var genreOptions2 = document.getElementById('genreOptions2');

genreOption.addEventListener('click', ()=>{
    genreOptions1.classList.remove('hidden');
    genreOptions2.classList.remove('hidden');
})


var afrobeats=document.getElementsByClassName('selectGenre')[0];
afrobeats.addEventListener('click', ()=>{
    category =afrobeats.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var afrosoul=document.getElementsByClassName('selectGenre')[1];
afrosoul.addEventListener('click', ()=>{
    category = afrosoul.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var amapiano=document.getElementsByClassName('selectGenre')[2];
amapiano.addEventListener('click', ()=>{
    category = amapiano.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var bongo=document.getElementsByClassName('selectGenre')[3];
bongo.addEventListener('click', ()=>{
    category = bongo.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var country=document.getElementsByClassName('selectGenre')[4];
country.addEventListener('click', ()=>{
    category = country.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var drill=document.getElementsByClassName('selectGenre')[5];
drill.addEventListener('click', ()=>{
    category = drill.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var gengetone=document.getElementsByClassName('selectGenre')[6];
gengetone.addEventListener('click', ()=>{
    category = gengetone.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var gospel=document.getElementsByClassName('selectGenre')[7];
gospel.addEventListener('click', ()=>{
    category = gospel.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var hiphop=document.getElementsByClassName('selectGenre')[8];
hiphop.addEventListener('click', ()=>{
    category = hiphop.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var house=document.getElementsByClassName('selectGenre')[9];
house.addEventListener('click', ()=>{
    category = house.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var pop=document.getElementsByClassName('selectGenre')[10];
pop.addEventListener('click', ()=>{
    category = pop.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var reggea=document.getElementsByClassName('selectGenre')[11];
reggea.addEventListener('click', ()=>{
    category = reggea.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var RnB=document.getElementsByClassName('selectGenre')[12];
RnB.addEventListener('click', ()=>{
    category = RnB.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var soul=document.getElementsByClassName('selectGenre')[13];
soul.addEventListener('click', ()=>{
    category = soul.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var softRock=document.getElementsByClassName('selectGenre')[14];
softRock.addEventListener('click', ()=>{
    category = softRock.innerHTML;
    chooseCategory ();
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover " + category;
})
var all=document.getElementsByClassName('selectGenre')[15];
all.addEventListener('click', ()=>{
    const reset = document.getElementById('songList');
    reset.innerHTML = '';
    const songRef = collection(db, 'songs');
    getDocs(songRef)
    .then((snapshot)=>{
      snapshot.docs.forEach((doc)=>{
        renderList(doc);
      })
    })
    .catch(err => {
      console.log(err)
    })
    genreOptions1.classList.add('hidden');
    genreOptions2.classList.add('hidden');
    discover.innerHTML = "Discover Great Music";
});

//reference Songs collection 
const chooseCategory = function(){
    console.log(category);
    const fetched =[];
    const reset = document.getElementById('songList');
    reset.innerHTML = '';
    const songRef = query(collection(db, 'songs'), where("genre", "==", category));
    console.log(songRef);

    getDocs(songRef)
    .then((snapshot)=>{
      snapshot.docs.forEach((doc)=>{
        renderList(doc);
        fetched.push({ ...doc.data(), 
            id: doc.id })
      })
      if (fetched.length == 0){
        let li=document.createElement('li');
        li.innerHTML = 'Category has no music yet';
        songList.appendChild(li);
    } 
    })
    .catch(err => {
      console.log(err)
    })
}

//comment section
const comments =document.getElementById('comments');
const commentSection = document.getElementById('commentSection');
const closeComments = document.getElementById('closeComments');
comments.addEventListener('click', ()=>{
  commentSection.classList.remove('hidden')
});
closeComments.addEventListener('click', ()=>{
  commentSection.classList.add('hidden')
});
