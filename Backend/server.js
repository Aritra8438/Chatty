const express = require("express");
const mongoose = require("mongoose");
const _http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
var http = _http.Server(app);
var io = socketio(http);

const dburl = "mongodb://localhost:27017/chatty";

mongoose.set("strictQuery", false);
mongoose
  .connect(dburl)
  .then(console.log("Connected to mongoDB"))
  .catch((err) => {
    console.log(err);
  });

let messageSet = [];
var messageModel = mongoose.model(
  "messageModel",
  {
    sender: String,
    receiver: String,
    msg: String,
    time: String,
  },
  "Messages"
);

var userModel = mongoose.model(
  "userModel",
  {
    email: String,
    name: String,
    friends: [
      {
        name: String,
      },
    ],
  },
  "Users"
);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:8080",
  })
);

io.on("connection", (socket) => {});
const PORT = 3001;

app.get("/get-messages", (req, res) => {
  messageModel
    .find(req.query)
    .then((messages) => {
      res.send(messages);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/get-user", (req, res) => {
  userModel
    .find(req.query)
    .then((user) => {
      if (user.length === 0) {
        res.send(null);
      } else res.send(user[0].name);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/add-user", (req, res) => {
  var instance = new userModel({
    name: req.body.name,
    email: req.body.email,
  });
  instance
    .save()
    .then(res.sendStatus(201))
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

app.patch("/add-friend", (req, res) => {
  let email = {
    email: req.body.email,
  };
  console.log(email);
  userModel
    .find(email)
    .then((user) => {
      if (user.length === 0) {
        res.send(null);
      } else {
        admin = user[0];
        console.log(admin);
        let friendMail = {
          email: req.body.friend,
        };
        userModel
          .find(friendMail)
          .then((friendUsers) => {
            console.log(friendUsers[0].name);
            console.log(typeof friendUsers[0].name);
            try {
              //admin.friends.push(friendUsers[0].name);
              admin.save();
            } catch (err) {
              console.log(err);
            }
            res.send("Done");
          })
          .catch((err) => {
            console.log(err);
            res.send("Fail");
          });
      }
    })
    .catch((err) => {
      //res.send(err);
    });
});

app.post("/send-message", (req, res) => {
  var instance = new messageModel({
    sender: req.body.sender,
    msg: req.body.msg,
    receiver: req.body.receiver,
    time: new Date().toLocaleString(),
  });
  query = {
    sender: req.body.sender,
    receiver: req.body.receiver,
  };
  instance
    .save()
    .then(
      messageModel
        .find(query)
        .then((messages) => {
          messageSet = messages;
          query = {
            receiver: req.body.sender,
            sender: req.body.receiver,
          };
          messageModel
            .find(query)
            .then((messages) => {
              messageSet.push(...messages);
              res.send(messageSet);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        })
    )
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  io.emit("message", req.body);
});

http.listen(PORT, () => {
  console.log("Server running on port 3000");
});
