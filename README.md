<p align="center">
    <img src="https://github.com/Aritra8438/GSoC_archive/assets/64671908/6e44b0f9-8dbd-421d-9763-8d1a402299d0">    
</p>
<p align="center"><b>A simple chat application based on socket.io</b></p>
<p align="center">
  <br>
  <a href="https://github.com/Aritra8438/Demo_E-commerce_Site/tree/master"><img src="https://img.shields.io/badge/LICENSE-MIT-green" alt="MIT" /></a>    
  <a href="#">
    <img src="https://badges.frapsoft.com/os/v1/open-source.png?v=103">
  </a>
</p>


# Index <br>
&nbsp;&nbsp;&nbsp;To quickly jump to a subsection, 
* [Website](https://github.com/Aritra8438/Chatty/tree/master#website-the-website-is-live)             
                
* [Local Development Setup](https://github.com/Aritra8438/Chatty/tree/master#local-development-setup)                
                
* [Features](https://github.com/Aritra8438/Chatty/tree/master#features)                
                
* [Scope of improvements](https://github.com/Aritra8438/Chatty/tree/master#scope-of-improvements)

# Website <br><br><a href="https://aritra8438.github.io/Chatty/"><strong>The website is Live !!</strong></a><br><br>
Here is a [live demo](https://youtu.be/YwS04n7Ss3U) of the local development setup.

 
# Local Development Setup

You need to run mongodb on localhost first to run this project locally.
Please follow this instructions here: 
- [windows](https://stackoverflow.com/questions/20796714/how-do-i-start-mongo-db-from-windows)
- [macOS](https://kb.objectrocket.com/mongo-db/start-mongodb-mac-how-to-start-mongodb-on-a-mac-438)
- [Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)


Open the terminal at the destination folder:
```bash
# cloning the repository
git clone https://github.com/Aritra8438/Chatty.git
```

This project's database is hosted at MongoDB Atlas. 
Pleas go through the documentation to go use remote atlas database eith this app.

Backend:
```bash
cd Backend
# Install the dependencies from package-lock.json
npm install 
# Your backend server is now ready, let's serve it
npm run dev
```
 Holla, you have run it on localhost:3001
 
 
 Let's start working on the frontend. Open the terminal at the current directory:
 ```bash
 cd frontend/chatty
 npm install
 npm run serve
 ```
 That's it. Your frontend is running on localhost:8080. <br> 
 
 Let's setup firebase:
 
 - Go to Firebase console and [add a new project](https://console.firebase.google.com/u/0/) 
 - Set up authenication method [here](https://console.firebase.google.com/u/0/project/chatty-52aa7/authentication/providers).
 - Make sure you have added Google sign-in as provider.
 - Register it as web app to get Firebase authentication object  

```python
const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "chatty-xxxxx.firebaseapp.com",
  projectId: "chatty-xxxxx",
  storageBucket: "chatty-xxxxx.appspot.com",
  messagingSenderId: "xxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxxxxxxxx",
};
```

- Copy this config and paste it to main.js inside Frontend/chatty

Congratulations, you have locally set up this project.
 
 

# Features

- Real time chat
- Chat persistence
- Sign-in and sign-up options
- simple ui


# Scope of Improvements

- Rich features like is user active?, last-seen, number of unread message can easily be added.
- Images and voice message support can be added to enhance UX.
- Add features for setiings, set background color, blocking someone etc.
- Cookies can be used to get rid off frequent login.

These improvements can be implemented with ease if needed .


 
 
 
