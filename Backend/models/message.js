const mongoose = require("mongoose");

var Message = mongoose.Schema({
  sender: String,
  receiver: String,
  msg: String,
  time: String,
});

module.exports = mongoose.model("Message", Message);
