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
    socket.userId = userId;
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });


  socket.on('privateMessage', (recipientId, message) => {
    // Send the message to the recipient
    console.log(socket.userId, message)

    io.to(recipientId).emit('privateMessage', socket.userId, message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });

}); 


app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/second", (req, res) => {
  res.sendFile(join(__dirname, "index1.html"));
});

app.get('/contacts/:id', (req, res) => {

})

app.get('/chats/:id/:receiver_id', (req, res) => {

})

app.post('/addContact', (req, res) => {

  //check username 
  //check number 
  //if found and 
  
})
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});




//get user contacts
//get chats with user
//post message {from,to,text,image,voice}
//add contact