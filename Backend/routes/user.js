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
  let data = {
    name: req.query.name,
  };
  await User.find(data)
    .then((user) => {
      if (user.length === 0) {
        res.status(200).send(null);
      } else res.status(200).send(user[0].name);
    })
    .catch((err) => {
      res
        .status(500)
        .send("There were some problems retrieving the user: ", String(err));
    });
});

router.post("", async (req, res) => {
  try {
    if (req.body.name && !validator.isAlphanumeric(req.body.name)) {
      throw new Error("Username must be Alphanumeric");
    }
    if (req.body.email && !validator.isEmail(req.body.email)) {
      throw new Error("Email is not valid");
    }
  } catch (err) {
    res.status(405).send("Please enter the correct username/email");
  }
  var instance = new User({
    name: req.body.name,
    email: req.body.email,
  });
  await instance
    .save()
    .then(() => {
      res.status(201).send("User has been created successfully");
    })
    .catch((err) => {
      res.status(500).send("There was an error checking user: " + String(err));
    });
});

router.get("/unique", async (req, res) => {
  await User.find(req.query)
    .then((users) => {
      if (users.length === 0) {
        res.status(200).send("user does not exist");
      } else res.status(200).send("User does exist");
    })
    .catch((err) => {
      res.status(500).send("There was an error creating user: " + String(err));
    });
});

module.exports = router;
