const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { join } = require("node:path");
const { Server } = require("socket.io");
const Auth = require("./appLogic");
const logic = new Auth();
const app = express();
app.use(cors());
const { createServer } = require("node:http");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (INSECURE - ONLY FOR DEVELOPME NT)
    methods: ["GET", "POST"],
    allowedHeaders: ["*"], // <-- Add custom headers if needed
    credentials: true,
  },
});
// connect MongoDB
mongoose.connect("mongodb://localhost:27017/chat-app");

// message Schema
const messageSchema = new mongoose.Schema({
  text: String,
  from: String,
  to: String,
  image: String,
  voice: String,
  file: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// user Schema
const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  gender: String,
  phoneNumber: String,
  image: String,
});
const User = mongoose.model("User", userSchema);


const baseUrl = 'https://eec9-212-8-253-146.ngrok-free.app/'
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Creat user on MongoDB 
app.post("/register", upload.fields([{ name: "image" }]), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(410).send("No files were uploaded.");
  }
  let user = req.body;
  let image;

  if (req.files.image) {
    image = req.files.image[0];
    const imagePath = `${req.protocol}://${req.get("host")}/uploads/${image.filename}`;
    user = { ...req.body, image: imagePath };
    const imagePaths = `${req.protocol}://${req.get("host")}/uploads/${image.filename}`;
    user = { ...req.body, image: imagePaths };
  }

  const registered = await logic.register(user);
  if (registered.ok) {
    const newUser = new User(user);
    await newUser.save();
    res.status(200).send({ ok: true, message: "Welcome, you have been registered successfully" });
  } else {
    if (registered.ok) {
      res.status(200).send(registered);
    }
    else {

      if (image) {
        const imagePath = path.join(__dirname, "uploads", image.filename);
        fs.unlink(imagePath, (err) => {
          if (err) {
            return res.status(500).send("Error deleting file.");
          }
        });
      }
      res.status(400).send(registered);
    }
  }
});

// logic login 
app.post("/login", async (req, res) => {
  const user = await logic.login({
    email: req.body.email,
    password: req.body.password,
  });
  user.ok ? res.status(201).send(user) : res.status(401).send(user);
});

//post and get messeg in MongoDB
async function saveMessage(data) {
  const message = new Message(data);
  await message.save();
  return message;
}

async function checkFiles(message, type) {
  let fileUrl = null;
  if (message[type]) {
    const uploadResult = await upload.single('file')(null, {
      file: message[type],
    });
    if (uploadResult.file) {
      fileUrl = `/uploads/${uploadResult.file.filename}`;
    }
  }
  return fileUrl
}
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("privateMessage", async (senderId, recipientId, message) => {
    let imageUrl = checkFiles(message, 'image');
    let voiceUrl = checkFiles(message, 'voice');
    let fileUrl = checkFiles(message, 'file');
    console.log(message)
    let msg = {
      id: 23,
      from: socket.userId,
      to: recipientId,
      text: message.text,
      image: 'imageUrl',
      voice: 'voiceUrl',
      file: 'fileUrl',
    }
    const savedMessage = await saveMessage(msg);
    io.to(recipientId).emit("privateMessage", socket.userId, savedMessage);
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId)
    });
  })
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/second", (req, res) => {
  res.sendFile(join(__dirname, "index1.html"));
});

app.get('/contacts', (req, res) => {

  res.send(
    {

      contacts: [
        {
          "id": 2,
          "username": "alaaalmedane",
          "firstName": "alaa",
          "lastName": "almedane",
          "gender": "Male",
          "phoneNumber": "0934552101",
          "image": `${baseUrl}/uploads/alaa.jpeg`,
          "messages": [
            {
              from: 1,
              to: 2,
              text: 'good and you',
              image: `${baseUrl}/uploads/alaa.jpeg`,
              voice: `${baseUrl}/uploads/voice.mp3`,
              time: 22324,
            },
            {
              from: 2,
              to: 1,
              text: 'hi how are you ',
              image: null,
              voice: null,
              time: 22323,
            },
          ]
        },
        {
          "id": 3,
          "username": "aliDabass",
          "firstName": "ali",
          "lastName": "dabass",
          "gender": "Male",
          "phoneNumber": "0934552101",
          "image": `${baseUrl}/uploads/alaa.jpeg`,
          "messages": [
            {
              id: 12,
              from: 3,
              to: 1,
              text: 'good and you',
              image: null,
              voice: null,
              time: 22324,
            },
            {
              id: 23,
              from: 1,
              to: 3,
              text: 'hi ali how are you ',
              image: null,
              voice: null,
              time: 22323,
            },
          ]
        }

      ]
    }
  )
})



app.post('/addContact', async (req, res) => {

  const result = await logic.addContact(req.body.senderId, { phoneNumber: req.body.phoneNumber, username: req.body.username })
  res.send(result)

})
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
 