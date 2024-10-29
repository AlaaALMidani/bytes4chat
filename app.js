const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { createServer } = require("http");
const Auth = require("./authLogic");
const auth = new Auth();
const app = express();
const server = createServer(app);
const io = new Server(server);

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
  }

  const registered = await auth.register(user);
  if (registered.ok) {
    const newUser = new User(user);
    await newUser.save();
    res.status(200).send({ ok: true, message: "Welcome, you have been registered successfully" });
  } else {
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
});

// auth login 
app.post("/login", async (req, res) => {
  const user = await auth.login({
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

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("privateMessage", async (recipientId, token, message) => {
    const msg = {
      from: socket.userId,
      to: recipientId,
      text: message.text,
      image: message.image,
      voice: message.voice,
      file: message.file,
    };

    const savedMessage = await saveMessage(msg);
    io.to(recipientId).emit("privateMessage", socket.userId, savedMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

// users and masseges
app.get("/contacts", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ contacts: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

// add new user
app.post("/addContact", async (req, res) => {
  const { username, phoneNumber } = req.body;
  const existingUser = await User.findOne({ username, phoneNumber });

  if (existingUser) {
    res.status(200).json({ ok: true, user: existingUser });
  } else {
    res.status(404).json({ ok: false, message: "User not found, maybe you can invite them!" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
