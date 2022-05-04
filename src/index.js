// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore, 
         collection, 
         getDocs 
} from "firebase/firestore";
import { getStorage,
         ref as storageRef } from "firebase/storage";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage;



//--------------------------------------variables and references-------------------------------------//
var files = [];
const reader = new FileReader();
const namebox =document.getElementById("namebox");
const extLabel =document.getElementById("extLabel");
const mySong =document.getElementById("mySong");
const select =document.getElementById("select");
const upload =document.getElementById("upload");
const progress =document.getElementById("progress");

//create an input element that will allow the user to select a file
const input = document.createElement("input");
input.type = "file";

input.onchange = (e) => {
  files = e.target.files;

  const extention = GetFileExt(files[0]);
  const name = GetFileName(files[0]);

  namebox.value = name;
  extLabel.innrHTML = extention;

  reader.readAsDataURL(files[0]);
}

//After reading a file, assign it to the audio element
//the reader will read the file as a URL 
//the result will go inside the audio source 
reader.onload = function(){
  mySong.src = reader.result;
}


//-----------------------selection function-------------------------//
select.onclick = function(){
  input.click();
}

function GetFileExt(file){
  const temp = file.name.split('.');
  const ext = temp.slice((temp.length - 1), (temp.length));
  return '.'+ ext[0];
}

function GetFileName(file){
  const temp = file.name.split('.');
  var fname = temp.slice(0, -1).join('.');
  return fname;
}

//--------------------------upload to cloud-storage--------------------------//
async function uploadProcess(){
  const songToUpload = files[0];
  const songName = namebox.value + extLabel.innrHTML;

  const storeRef = storageRef(storage, "Songs/"+songName);
  const uploadTask = uploadBytesResumable(storeRef, songToUpload);

  uploadTask.on('state-changed',(snapshot)=>{
    const progressPercentage = (snapshot.bytestransferred/snapshot.totalBytes)*100
    progress.innerHTML = 'Upload '+progressPercentage+'%';
  },
  (error) => {
    alert('Error: File not uploaded. Please try again.')
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref)
    .then((downloadURL)=>{
      console.log(downloadURL);
    });
  });
}

upload.onclick = uploadProcess;

