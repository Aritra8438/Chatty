<template>
  <div class='container' v-cloak v-app="chatApp">
    <div v-if="!logged_in && !signing_up">
      <h1>Welcome to</h1>
      <h1>Chatty</h1>
      <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
      <div class="google-btn" style="cursor: default;" @click="googleSignIn">
        <div class="google-icon-wrapper">
          <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
        </div>
        <p class="btn-text"><b>Sign in with google</b></p>
      </div>
    </div>
    <div v-if="signing_up">
      <h3 style="color: white">It looks like it's your first time using chatty, Choose an interesting username</h3>
      <br><br>
      <div style="left: 37%; position: absolute;">
        <input class="btn btn-accept " type="submit" @click="addUser"
          style="float: right; left: 70%; bottom: -100%; position: absolute;" />
        <div style="overflow: hidden; padding-right: .5em;">
          <input type="text" placeholder="Choose Name" v-model="admin"
            style="background-color: transparent; border: none; caret-color: azure; color: azure;font-size: x-large; width: 80%;" />
        </div>
      </div>
    </div>
    <h1 v-if="logged_in" style="color:aquamarine;">Chatty</h1>
    <div v-if="logged_in" class='chatbox' id="MessageCtrl as chatMessage">
      <div class='chatbox__user-list'>
        <h1>Friend list</h1>
        <div v-for="friend in friendList" class='chatbox__user--active' :key="friend">
          <div style="cursor: pointer" @click="() => {
            currentReceiver = friend;
            getData(admin, friend);
          }">
            <p>{{ friend }}</p>
          </div>
        </div>
        <input type="text" style="background-color: transparent; border: none; caret-color: azure; color: azure;"
          placeholder="   Add more friends?" v-model="friend" @keyup.enter="addFriend">
      </div>
      <div class="chatbox__messages__user-message--ind-message-right" v-if="!currentReceiver">
        <p class="name"> Hello </p>
        <br />
        <p class="message"> Please select a frined to proceed </p>
      </div>
      <div ref="scroll_down" style="overflow-y:scroll; overflow-x:hidden; height:435px;">
        <div class="chatbox__messages" v-for="message in messageSet" :key="message.key">
          <div class="chatbox__messages__user-message">
            <div v-if="admin === message.sender">
              <div class="chatbox__messages__user-message--ind-message-left">
                <p class="name">{{ message.sender }}</p>
                <br />
                <p class="message">{{ message.msg }}</p>
              </div>
            </div>
            <div v-if="admin === message.receiver">
              <div class="chatbox__messages__user-message--ind-message-right">
                <p class="name">{{ message.sender }}</p>
                <br />
                <p class="message">{{ message.msg }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form>
        <input :disabled="!currentReceiver" type="text" placeholder="Enter your message" v-model="message"
          @keyup.enter="sendMessage">
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';
import firebase from "firebase/compat/app";
import io from 'socket.io-client';
const socket = io('http://localhost:3001', { transports: ['websocket'] });
export default {
  data() {
    return {
      message: "",
      logged_in: false,
      signing_up: false,
      admin: "",
      friend: "",
      admin_email: "",
      currentReceiver: null,
      messageSet: [],
      friendList: [],
      isUnique: false,
    }
  },
  methods: {
    async checkUserUnique() {
      if (this.admin.length <= 3) {
        return;
      }
      let url = "/user/unique?name=" + this.admin
      await axios
        .get(url)
        .then((response) => {
          console.log(response);
          if (response.data === "user does not exist") {
            this.isUnique = true;
          }
          else {
            this.isUnique = false;
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        })
    },
    async getFriends() {
      let url = "/friends?name=" + this.admin
      await axios
        .get(url)
        .then((response) => {
          this.friendList = response.data;
        })
        .catch((err) => {
          console.log(err);
        })
    },
    async addUser() {
      await this.checkUserUnique()
      if (this.isUnique) {
        let url = "/user/";
        let payload = {
          "name": this.admin,
          "email": this.admin_email,
        }
        await axios
          .post(url, payload)
          .then(() => {
            this.logged_in = true; this.signing_up = false;
          })
          .catch((err) => { console.log(err) })
      }
      else {
        toast({
          message: 'Username is already taken',
          "duration": 2000,
          "position": "top-right",
          "closeOnClick": true,
          "opacity": 1,
          "single": false,
          "offsetTop": 0,
          "offsetBottom": 0,
          "offsetLeft": 0,
          "offsetRight": 0
        });
      }
    },
    async addFriend() {
      let url = "/friend/";
      let payload = {
        "email": this.admin_email,
        "friend": this.friend,
      }
      await axios
        .patch(url, payload)
        .then((response) => {
          if (response.data === "") {
            toast({
              message: 'No such user exists',
              "duration": 2000,
              "position": "top-right",
              "closeOnClick": true,
              "opacity": 1,
              "single": false,
              "offsetTop": 0,
              "offsetBottom": 0,
              "offsetLeft": 0,
              "offsetRight": 0
            });
          }
          this.friend = "";
        })
        .catch((err) => {
          console.log(err)
        })
      this.getFriends();
    },
    googleSignIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((response) => {
          let user_email = response.additionalUserInfo.profile.email;
          let url = "/user?email=" + user_email;
          axios
            .get(url)
            .then((response) => {
              if (response !== null) {
                this.admin = response.data;
                if (this.admin === "") {
                  this.signing_up = true;
                  this.admin_email = user_email;
                }
                else {
                  this.logged_in = true;
                  this.admin_email = user_email;
                  this.getFriends();
                }
              }
            })
            .catch((err) => { console.log(err) })
        })
        .catch((err) => {
          console.log(err);
        })
    },
    sortMessages(array) {
      return array.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    },
    scrollToEnd() {
      var container = this.$refs.scroll_down;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    },
    async sendMessage() {
      let url = "/message/";
      let payload = {
        "sender": this.admin,
        "receiver": this.currentReceiver,
        "msg": this.message
      }
      let tempMessageSet = [];
      await axios
        .post(url, payload)
        .then((response) => { tempMessageSet = response.data; this.message = ""; })
        .catch((err) => { console.log(err) })
      this.messageSet = this.sortMessages(tempMessageSet);
      this.scrollToEnd();
    },
    async getData(sender = null, receiver = null) {
      let url = "/messages";
      let tempMessageSet = [];
      if (sender && receiver) {
        url += "?sender=" + sender + "&receiver=" + receiver;
        this.currentReceiver = receiver;
      }
      await axios
        .get(url)
        .then((response) => { tempMessageSet = response.data; })
        .catch((err) => { console.log(err) })
      url = "/messages";
      if (sender && receiver) {
        url += "?sender=" + receiver + "&receiver=" + sender;
      }
      await axios
        .get(url)
        .then((response) => { this.messageSet.push.apply(tempMessageSet, response.data); })
        .catch((err) => { console.log(err) })
      this.messageSet = this.sortMessages(tempMessageSet);
      this.scrollToEnd();
    }
  },
  mounted() {
    // setInterval(() => {
    //   this.getFriends();
    //   if (this.currentReceiver) {
    //     this.getData(this.admin, this.currentReceiver)
    //   }
    // }, 1000);
    socket.on('connect', () => {
    })
    socket.on('message', () => {
      this.getFriends();
      if (this.currentReceiver) {
        this.getData(this.admin, this.currentReceiver)
      }
    })
  }
}
</script>

<style lang="scss">
// Variables
$primary: rgba(23, 190, 187, 1);
$secondary: rgba(240, 166, 202, 1);
$blue: #3498db;

$active: rgba(23, 190, 187, 0.8);
$busy: rgba(252, 100, 113, 0.8);
$away: rgba(255, 253, 130, 0.8);

input:focus {
  outline: none;
}

// Triangle Mixin
@mixin triangle($color, $size, $direction) {
  width: 0;
  height: 0;

  @if $direction =="up" {
    border-right: ($size + px) solid transparent;
    border-left: ($size + px) solid transparent;
    border-bottom: ($size + px) solid $color;
  }

  @if $direction =="down" {
    border-right: ($size + px) solid transparent;
    border-left: ($size + px) solid transparent;
    border-top: ($size + px) solid $color;
  }

  @if $direction =="right" {
    border-top: ($size + px) solid transparent;
    border-bottom: ($size + px) solid transparent;
    border-left: ($size + px) solid $color;
  }

  @if $direction =="left" {
    border-top: ($size + px) solid transparent;
    border-bottom: ($size + px) solid transparent;
    border-right: ($size + px) solid $color;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
}

html,
body {
  background: linear-gradient(120deg, $primary, $secondary);
  overflow: hidden;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;

  h1 {
    margin: 0.5em auto;
    color: #FFF;
    text-align: center;
  }
}

.sign-in {
  border-color: $blue;
  color: #fff;
  box-shadow: 0 0 40px 40px $blue inset, 0 0 0 0 $blue;
  transition: all 150ms ease-in-out;

  &:hover {
    box-shadow: 0 0 10px 0 $blue inset, 0 0 10px 4px $blue;
  }
}

$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669F2;

.google-btn {
  width: 190px;
  height: 42px;
  background-color: $google-blue;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .25);

  .google-icon-wrapper {
    position: absolute;
    margin-top: 1px;
    margin-left: 1px;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    background-color: $white;
  }

  .google-icon {
    position: absolute;
    margin-top: 11px;
    margin-left: 11px;
    width: 18px;
    height: 18px;
  }

  .btn-text {
    float: right;
    margin: 11px 11px 0 0;
    color: $white;
    font-size: 14px;
    letter-spacing: 0.2px;
    font-family: "Roboto";
  }

  &:hover {
    box-shadow: 0 0 6px $google-blue;
  }

  &:active {
    background: $button-active-blue;
  }
}

@import url(https://fonts.googleapis.com/css?family=Roboto:500);

.chatbox {
  background: rgba(255, 255, 255, 0.05);
  width: 600px;
  height: 80%;
  border-radius: 0.2em;
  position: relative;
  box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1);

  &__messages {
    .chatbox__messages__user-message--ind-message-left {
      float: left;

      // &:after {
      //   content: '';
      //   position: absolute;
      //   margin: -1.5em -17.06em;
      //   @include triangle(rgba(255, 255, 255, 0.2), 10, left);
      // }
    }

    .chatbox__messages__user-message--ind-message-right {
      float: right;

      // &:after {
      //   content: '';
      //   position: absolute;
      //   margin: -1.5em -17.06em;
      //   @include triangle(rgba(255, 255, 255, 0.2), 10, left);
      // }
    }

  }

  &__messages__user-message {
    width: 450px;
  }

  &__messages__user-message--ind-message-left {
    background: rgba(255, 255, 255, 0.2);
    padding: 1em 0;
    height: auto;
    width: 65%;
    border-radius: 5px;
    margin: 2em 1em;
    overflow: auto;

    &>p.name {
      color: #FFF;
      font-size: 1em;
    }

    &>p.message {
      color: #FFF;
      font-size: 0.7em;
      margin: 0 2.8em;
    }
  }

  &__messages__user-message--ind-message-right {
    background: rgba(255, 255, 255, 0.2);
    padding: 1em 0;
    height: auto;
    width: 65%;
    border-radius: 5px;
    margin: 2em 1em;
    overflow: auto;

    &>p.name {
      color: #FFF;
      font-size: 1em;
    }

    &>p.message {
      color: #FFF;
      font-size: 0.7em;
      margin: 0 2.8em;
    }
  }

  &__user-list {
    background: rgba(255, 255, 255, 0.1);
    width: 25%;
    height: 100%;
    float: right;
    border-top-right-radius: 0.2em;
    border-bottom-right-radius: 0.2em;

    h1 {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9em;
      padding: 1em;
      margin: 0;
      font-weight: 300;
      text-align: center;
    }
  }

  &__user {
    width: 0.5em;
    height: 0.5em;
    border-radius: 100%;
    margin: 1em 0.7em;

    &--active {
      @extend .chatbox__user;
      background: $active;
    }

    &--busy {
      @extend .chatbox__user;
      background: $busy;
    }

    &--away {
      @extend .chatbox__user;
      background: $away;
    }
  }

  p {
    float: left;
    text-align: left;
    margin: -0.25em 2em;
    font-size: 0.7em;
    font-weight: 300;
    color: #FFF;
    width: 200px;
  }

  form {
    background: #222;

    input {
      background: rgba(255, 255, 255, 0.03);
      position: absolute;
      bottom: 0;
      left: 0;
      border: none;
      width: 75%;
      padding: 1.2em;
      outline: none;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 300;
    }
  }
}

body {
  overflow: hidden;
}

.button-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn {
  font-size: 30px;
  margin: 15px;
  padding: 10px 20px;
  color: white;
  border-radius: 10px;
  border-color: transparent;
  cursor: pointer;
  transition: background-color 0.5s ease-in-out;
}

.btn-accept {
  background-color: rgba(66, 184, 131, 0.6);
}

.btn-accept:hover {
  background-color: rgb(66, 184, 131);
}


// Placeholder Styling
::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.9);
}

:-moz-placeholder {
  color: rgba(255, 255, 255, 0.9);
}

::-moz-placeholder {
  color: rgba(255, 255, 255, 0.9);
}

::-webkit-scrollbar {
  display: none;
}

:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.9);
}
</style>