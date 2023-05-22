const express = require("express");
const router = express.Router();
const User = require("../models/user");
const validator = require("validator");

router.get("", async (req, res) => {
  try {
    if (req.query.name && !validator.isAlphanumeric(req.query.name)) {
      throw new Error("Username must be Alphanumeric");
    }
    if (req.query.email && !validator.isEmail(req.query.email)) {
      throw new Error("Email is not valid");
    }
  } catch (err) {
    res.status(405).send("Please enter the correct username/email");
    return;
  }
  console.log(req.query);
  await User.find(req.query)
    .then((users) => {
      res.status(200).send(users[0].friends);
    })
    .catch((err) => {
      res
        .status(500)
        .send("There was some error retrieving friends: " + String(err));
    });
});

router.patch("/", async (req, res) => {
  try {
    if (req.body.name && !validator.isEmail(req.body.email)) {
      throw new Error("Email is not valid");
    }
    if (req.body.email && !validator.isEmail(req.body.friend)) {
      throw new Error("Fried Email is not valid");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Please enter the correct username/email");
  }
  let email = {
    email: req.body.email,
  };
  await User.find(email)
    .then(async (users) => {
      if (users.length === 0) {
        res.status(400).send("Are you logged in?");
        return;
      } else {
        admin = users[0];
        let friendMail = {
          email: req.body.friend,
        };
        await User.find(friendMail)
          .then(async (friendUsers) => {
            try {
              if (friendUsers.length === 0) {
                res.status(200).send("No friend Found");
                return;
              }
              let friend = friendUsers[0];
              if (!admin.friends.includes(friend.name))
                admin.friends.push(String(friend.name));
              if (!friend.friends.includes(admin.name))
                friend.friends.push(String(admin.name));
              await admin.save();
              await friend.save();
              res.status(201).send("Friend Added");
            } catch (err) {
              res
                .status(500)
                .send("There was some error adding friend: " + String(err));
            }
          })
          .catch((err) => {
            res
              .status(500)
              .send("There was some error adding friend: " + String(err));
          });
      }
    })
    .catch((err) => {
      res.status(500).send("There was some error finding user:" + String(err));
    });
});

module.exports = router;
