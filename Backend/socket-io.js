const socketio = require("socket.io");

const { app, http } = require("./http");

io = socketio(http);

module.exports = io;
