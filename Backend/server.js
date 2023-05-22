const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { app, http } = require("./http");
const io = require("./socket-io");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

require("./db");
const User = require("./models/user");
const Message = require("./models/message");

io.on("connection", (socket) => {
  console.log("One client Connected");
});
const PORT = 3001;

const messageRoute = require("./routes/message");
const userRoute = require("./routes/user");
const friendRoute = require("./routes/friend");

app.use("/message", messageRoute);
app.use("/user", userRoute);
app.use("/friends", friendRoute);

http.listen(PORT, () => {
  console.log("Server running on port 3001");
});
