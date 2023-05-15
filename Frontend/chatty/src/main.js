import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBqe-OwI5Y55YsWOKq5s22SXRT5MvtWkpY",
  authDomain: "chatty-52aa7.firebaseapp.com",
  projectId: "chatty-52aa7",
  storageBucket: "chatty-52aa7.appspot.com",
  messagingSenderId: "532520761164",
  appId: "1:532520761164:web:47bbb443beed2d58f701e9",
  measurementId: "G-SRWQVRYGWP",
};
firebase.initializeApp(firebaseConfig);

axios.defaults.baseURL = "http://127.0.0.1:3001/";
createApp(App).use(store).use(router, axios, firebase).mount("#app");
