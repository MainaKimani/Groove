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



//--------------------------------------variables and references-------------------------------------//
var files = [];
const reader = new FileReader();
const namebox =document.getElementById("namebox");
const extLabel =document.getElementById("extLabel");
const mySong =document.getElementById("mySong");
const select =document.getElementById("select");
const upload =document.getElementById("upload");
const progress =document.getElementById("progress");
const uploadProgress=document.getElementById("uploadProgress");
const cancelUpload=document.getElementById("cancelUpload");

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

  namebox.classList.remove("hidden");
  select.classList.add("hidden");
  upload.classList.remove("hidden");
  cancelUpload.classList.remove("hidden");

  return fname;
}

cancelUpload.onclick = function(){
  namebox.value = '';
  files=[];
  namebox.classList.add("hidden");
  select.classList.remove("hidden");
  upload.classList.add("hidden");
  cancelUpload.classList.add("hidden");
}

//--------------------------upload to cloud-storage--------------------------//
async function uploadProcess(){
  const songToUpload = files[0];
  const songName = namebox.value + extLabel.innrHTML;
  const metaData = {
      contentType: songToUpload.type
  }

  const storeRef = storageRef(storage, "Songs/"+ songName);
  const uploadTask = uploadBytesResumable(storeRef, songToUpload,metaData);

  uploadTask.on('state-changed',
  (snapshot)=>{
      uploadProgress.classList.remove("hidden");
      const progressPercentage = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100);
      progress.innerHTML = 'Uploading: '+progressPercentage+'%';
      uploadProgress.value = progressPercentage;
      if (progressPercentage == 100){
        namebox.classList.add("hidden");
        select.classList.remove("hidden");
        upload.classList.add("hidden");
        cancelUpload.classList.add("hidden");
        uploadProgress.classList.add("hidden");
        progress.innerHTML =  "";
      }
    },
    (error) => {
      alert('Error: File not uploaded. Please try again.')
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL)=>{
        SaveURLtoFirestore(downloadURL);
        console.log(downloadURL);
      });
    });
  }



//------------------------------Saving to firestore --------------------------------------//
async function SaveURLtoFirestore(url){
  const name = namebox.value;
  const ext = extLabel.innerHTML;

  //Setting up the firestore collection of the song URL
  const ref = doc(db, "SongURL/"+name);

  await setDoc(ref,{
    songName: (name+ext),
    songURL: url  
  })
}

/*
async function GetSongFromFirestore(){
  const name=namebox.value();
  const ref = doc(db, "SongURL/"+name);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    mySong.src = docSnap.data().songURL;
  }
}
*/

upload.onclick = uploadProcess;
