
require('dotenv').config();
const connectDB = require("./src/config/db");
const http = require("http");
const app = require("./src/app");
const { initSocket } = require("./src/socket/socket");
require("dotenv").config();

const server = http.createServer(app);
const dns = require("node:dns/promises");
const e = require('express');
dns.setServers(["8.8.8.8", "1.1.1.1"]);


// initialize socket
const io = initSocket(server);
connectDB(); 

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Service running on ${PORT}`);
});

module.exports = { io };