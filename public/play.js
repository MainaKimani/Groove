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

  let progressbar = parseInt((music.currentTime / music.duration)*100);
  seek.value = progressbar;
  let seekbar = seek.value;
  bar2.style.width = `${seekbar}%`;
  dot.style.left = `${seekbar}%`;
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

/*
let left_scroll = document.getElementById('left_scroll');
let right_scroll = document.getElementById('right_scroll');
let pop_song = document.getElementsByClassName('pop_song')[0];

left_scroll.addEventListener('click', () =>{
  pop_song.scrollleft -= 330;
})
right_scroll.addEventListener('click', () =>{
  pop_song.scrollleft += 330;
})
*/

//Category selection
var category;
var afrobeats=document.getElementsByClassName('selectGenre')[0];
afrobeats.addEventListener('click', ()=>{
    category =afrobeats.innerHTML;
    console.log(category);
})
var afrosoul=document.getElementsByClassName('selectGenre')[1];
afrosoul.addEventListener('click', ()=>{
    category = afrosoul.innerHTML;
    console.log(category);
})
var amapiano=document.getElementsByClassName('selectGenre')[2];
amapiano.addEventListener('click', ()=>{
    category = amapiano.innerHTML;
    console.log(category);
})
var bongo=document.getElementsByClassName('selectGenre')[3];
bongo.addEventListener('click', ()=>{
    category = bongo.innerHTML;
    console.log(category);
})
var country=document.getElementsByClassName('selectGenre')[4];
country.addEventListener('click', ()=>{
    category = country.innerHTML;

})
var drill=document.getElementsByClassName('selectGenre')[5];
drill.addEventListener('click', ()=>{
    category = drill.innerHTML;
    
})
var gengetone=document.getElementsByClassName('selectGenre')[6];
gengetone.addEventListener('click', ()=>{
    category = gengetone.innerHTML;
    
})
var gospel=document.getElementsByClassName('selectGenre')[7];
gospel.addEventListener('click', ()=>{
    category = gospel.innerHTML;
    
})
var hiphop=document.getElementsByClassName('selectGenre')[8];
hiphop.addEventListener('click', ()=>{
    category = hiphop.innerHTML;
    
})
var house=document.getElementsByClassName('selectGenre')[9];
house.addEventListener('click', ()=>{
    category = house.innerHTML;
    
})
var pop=document.getElementsByClassName('selectGenre')[10];
pop.addEventListener('click', ()=>{
    category = pop.innerHTML;
    
})
var reggea=document.getElementsByClassName('selectGenre')[11];
reggea.addEventListener('click', ()=>{
    category = reggea.innerHTML;
    
})
var RnB=document.getElementsByClassName('selectGenre')[12];
RnB.addEventListener('click', ()=>{
    category = RnB.innerHTML;
    
})
var soul=document.getElementsByClassName('selectGenre')[13];
soul.addEventListener('click', ()=>{
    category = soul.innerHTML;

})
var softRock=document.getElementsByClassName('selectGenre')[14];
softRock.addEventListener('click', ()=>{
    category = softRock.innerHTML;
    
})

 
onAuthStateChanged(auth, async (user) => {
    console.log(user.uid);
    //reference Songs collection 
    const colRef = query(collection(db, 'songs'), where("genre", "==", category));
  
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