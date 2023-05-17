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
* [Website](https://github.com/Aritra8438/Chatty/tree/main#website-the-website-is-live)             
                
* [Local Development Setup](https://github.com/Aritra8438/Chatty/tree/main#local-development-setup)                
                
* [Features](https://github.com/Aritra8438/Chatty/tree/main#features)                
                
* [Scope of improvements](https://github.com/Aritra8438/Chatty/tree/main#scope-of-improvements)

# Website <br>
<a href="https://aritra8438.github.io/Chatty/"><strong>The website is Live !!</strong></a>
<br>
Here is a [video demo](https://www.youtube.com/watch?v=Ex2_z9XPSmE) of the local development setup.

 
# Local Development Setup

**Database:**

You need to run mongodb on localhost first to run this project locally.
Please follow this instructions here: 
- [Windows](https://stackoverflow.com/questions/20796714/how-do-i-start-mongo-db-from-windows)
- [MacOS](https://kb.objectrocket.com/mongo-db/start-mongodb-mac-how-to-start-mongodb-on-a-mac-438)
- [Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

Alternatively, you can host your database at `MongoDB Atlas`.
Please go through the [documentation](https://www.mongodb.com/docs/atlas/app-services/apps/) to go use remote atlas database with this app.

All you need is a connection string:

`mongodb://localhost:27017/`

`mongodb+srv://aritra8438:*****@cluster0.gownv1w.mongodb.net/?retryWrites=true&w=majority`

Replace dburl with this string.

**Git:**

Open the terminal at the destination folder:
```bash
# cloning the repository
git clone https://github.com/Aritra8438/Chatty.git
```

**Backend:**
```bash
cd Backend
# Install the dependencies from package-lock.json
npm install 
# Your backend server is now ready, let's serve it
npm run dev
```

Holla, you have run it on localhost:3001
 
 **Frontend:**
 
 ```bash
 cd frontend/chatty
 npm install
 npm run serve
 ```
 That's it. Your frontend is running on localhost:8080. 
 
 **Firebase:**
 
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


**Congrats, you have run the projcet locally.**

**Polling vs websockets:**
While running locally, you can use streaming as it has superior performance.
But while deploying, make sure that you have used polling as some hosting platforms (eg. **vercel**) don't allow websockets.
 

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


 
 
 
