import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  //Get your firebase authentication here
};
firebase.initializeApp(firebaseConfig);

axios.defaults.baseURL = "http://127.0.0.1:3001/";
createApp(App).use(store).use(router, axios, firebase).mount("#app");
