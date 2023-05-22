const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const io = require("../socket-io");

router.get("", async (req, res) => {
  await Message.find(req.query)
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch((err) => {
      res
        .status(500)
        .send(
          "There were some problems retrieving the messages: ",
          String(err)
        );
    });
});

router.post("", async (req, res) => {
  var instance = new Message({
    sender: req.body.sender,
    msg: req.body.msg,
    receiver: req.body.receiver,
    time: new Date().toLocaleString(),
  });
  query = {
    sender: req.body.sender,
    receiver: req.body.receiver,
  };
  await instance
    .save()
    .then(async () => {
      await Message.find(query)
        .then(async (messages) => {
          let messageSet = messages;
          query = {
            receiver: req.body.sender,
            sender: req.body.receiver,
          };
          await Message.find(query)
            .then((messages) => {
              messageSet.push(...messages);
              res.status(201).send(messageSet);
            })
            .catch((err) => {
              res
                .status(500)
                .send("Messages can not be delivered: " + String(err));
            });
        })
        .catch((err) => {
          res.status(500).send("Messages can not be delivered: " + String(err));
        });
    })
    .catch((err) => {
      res.status(500).send("Messages can not be delivered: " + String(err));
    });
  io.emit("message");
});

module.exports = router;
