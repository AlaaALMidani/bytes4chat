const multer = require("multer");
const cors = require("cors");
const { join } = require("node:path");
const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("node:http");

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
