const express = require("express");
const mongoose = require("mongoose");
const _http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
var http = _http.Server(app);
var io = socketio(http);

const dburl =
  "mongodb+srv://aritra8438:<>password>@cluster0.gownv1w.mongodb.net/?retryWrites=true&w=majority";

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
    friends: [],
  },
  "Users"
);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

io.on("connection", (socket) => {});
const PORT = 3001;

app.get("/Hey", (req, res) => {
  res.send("Hello");
});

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

app.get("/get-friends", (req, res) => {
  userModel
    .find(req.query)
    .then((users) => {
      res.send(users[0].friends);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/check-user-unique", (req, res) => {
  userModel
    .find(req.query)
    .then((users) => {
      if (users.length === 0) {
        res.send("1");
      } else res.send("");
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

app.patch("/add-friend/", (req, res) => {
  let email = {
    email: req.body.email,
  };
  userModel
    .find(email)
    .then((users) => {
      if (users.length === 0) {
        res.send(null);
        return;
      } else {
        admin = users[0];
        let friendMail = {
          email: req.body.friend,
        };
        userModel
          .find(friendMail)
          .then((friendUsers) => {
            try {
              if (friendUsers.length === 0) {
                res.send(null);
                return;
              }
              let friend = friendUsers[0];
              if (!admin.friends.includes(friend.name))
                admin.friends.push(String(friend.name));
              if (!friend.friends.includes(admin.name))
                friend.friends.push(String(admin.name));
              admin.save();
              friend.save();
              res.send("Friend Added");
            } catch (err) {
              console.log(err);
              res.sendStatus(404);
            }
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(404);
          });
      }
    })
    .catch((err) => {
      res.send(err);
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
  io.emit("message");
});

http.listen(PORT, () => {
  console.log("Server running on port 3001");
});
