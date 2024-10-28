const multer = require("multer");
const cors = require("cors");
const { join } = require("node:path");
const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("node:http");

const app = express();
const server = createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
  
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.userId = userId; // Store user ID on the socket
    socket.join(userId); // Join the room associated with the user ID
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });

  socket.on('privateMessage', (recipientId, message) => {
    // Send the message to the recipient
    io.to(recipientId).emit('privateMessage', socket.userId, message);
  }); 

});


app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
