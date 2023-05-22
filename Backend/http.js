const express = require("express");
const _http = require("http");

const app = express();
const http = _http.Server(app);

module.exports = { app, http };
