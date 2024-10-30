var bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Auth = require("./authLogic");
const auth = new Auth();
const app = express();
const { join } = require("node:path");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const server = createServer(app);
const io = new Server(server);


const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url, new Date(), res.status);
  next();
});
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


app.post("/register", upload.fields([{ name: "image" }]), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(410).send("No files were uploaded.");
  }
  let user = req.body;
  let image;
  if (req.files.image) {

    image = req.files.image[0];
    const imagePaths = `${req.protocol}://${req.get("host")}/uploads/${image.filename
      }`;
    user = { ...req.body, image: imagePaths };
  }
  console.log(user);
  const registered = await auth.register(user);

  if (registered.ok) {
    res.status(200).send({
      ok: true,
      message: "Welcome , you have been registered successfully",
    });
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

app.post("/login", async (req, res) => {
  const user = await auth.login({
    email: req.body.email,
    password: req.body.password,
  });
  user.ok ? res.status(201).send(user) : res.status(401).send(user);
});

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
io.on('connection', (socket) => {

  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.userId = userId;
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });


  socket.on('privateMessage', async (recipientId, token, message) => {
    console.log( message)
    // let imageUrl = checkFiles(message, 'image'); 
    // let voiceUrl = checkFiles(message, 'voice');
    // let fileUrl = checkFiles(message, 'file');

    // let msg = {
    //   id: 23,
    //   from: socket.userId,
    //   to: recipientId,
    //   text: message.text,
    //   image: imageUrl,
    //   voice: voiceUrl,
    //   file: fileUrl,
    // }
    console.log(message)
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
          "image": "http://localhost:3000/uploads/1730033323200.png",
          "massages": [
            {
              from: 1,
              to: 2,
              text: 'good and you',
              image: null,
              voice: null,
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
          "image": "http://localhost:3000/uploads/1730033323200.png",
          "massages": [
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

app.get('/chats/:id/:receiver_id', (req, res) => {

})

app.post('/addContact', (req, res) => {

  //check username 
  //check number 
  //if found and 






  res.send({
    ok: false,
    message: 'user not found maybe you can invite him !'
  })

})
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
