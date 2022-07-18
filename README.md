# Groove Hits


Groove Hits is a music player web application project that is developed mainly using vanilla JavaScript and Firebase as the backend service.
The project essentially allows users to upload music and listen to music. 
Users can listen and enjoy the music uploaded by other users regardless of their auth. status. However, One must be signed in to upload music.

The website can be accessed via https://groove-hits.web.app/play.html

## Language and Tools Used
1. Editor (eg: Vscode)
2. Javascript 
3. HTML
4. CSS
5. Firestore

## Functionalities
### 1. Authentication 
Signin and login using email and password; Facebook API, twitter API, and google API.

### 2. Upload to Cloud Storage (Add Data)
Authenticated users can upload their music to groove hits, while anuthenticated users will be requested to signin/login.
Uploaded music is stored in the cloud (thanks to Firebase), then the media URLs are copied to Firestore.

### 3. Play Music (Fetch Data)
Both authenticated and unauthenticated users can play music.
Whenever music is being played, the ID associated to the selected music adds the URL to the audio tag, fetches the song title, names of the artists, and the cover art.

### 4. Edit and Delete Data
Users can viw the songs that they have upload, edit certain fields, or delete the music if they wish to do so.

### 5. Collections
Music can be grouped into various collections based on the genre.


## What Next?
This project is quite far from completion according to what I have in mind.
Updates will be rolled out so keep checking out for the changes.

Here are some of the updates that will be effected soon:

-UI/UX restructuring (Current version is not mobile responsive)

-User ability to create playlists and add music the playlists. 

-User ability to interact with each other and comment on uploaded music.

