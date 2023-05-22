const mongoose = require("mongoose");
const validator = require("validator");

var User = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  friends: {
    type: [String],
  },
});

module.exports = mongoose.model("User", User);
