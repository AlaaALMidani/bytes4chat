[
  {
    from: 1,
    to: 2,
    message: 1,
  },
]

let texts = [
  {
    id: 1,
    text: "hello",
  }
]

let voices = [
    {
      id: 1,
      voice: "hello",
    }
  ]
  
let images =[

  {
    id: 1,
    image: "http://localhost:3000/uploads/1730033323200.png",
  }

];

let chats = [
  {
    from: 1,
    to: 2,
    text: 1,
    image: 1,
    voice: 2,
    from: 2,
    time:22323,
  },

  {
    from: 1,
    to: 2,
    text: 1,
    image: 1,
    voice: 2,
    from: 2,
  },
];



let body = {
    from:2,
    to:3
}
let v = chats.filter ((e)=>e.from == body.from && e.to == body.to) 

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      


let users = [
  {
    id: 1,
    username: "alawefwefwef",
    firstName: "alaa",
    lastName: "mid",
    gender: "Male",
    phoneNumber: "0934552101",
    image: "http://localhost:3000/uploads/1730033323200.png",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsYXdlZndlZndlZiIsInBob25lTnVtYmVyIjoiMDkzNDU1MjEwMSIsImlhdCI6MTczMDAzMzMyMywiZXhwIjoxNzMwMDM2OTIzfQ.vIZ4U3JIRFx8xM7kSnL3Akv3WMg_aHOvSEg8A4n9-gk",
    contacts: [2, 3, 34],
  },
  {
    id: 3,
    username: "alawefwefwef",
    firstName: "alaa",
    lastName: "mid",
    gender: "Male",
    phoneNumber: "0934552101",
    image: "http://localhost:3000/uploads/1730033323200.png",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsYXdlZndlZndlZiIsInBob25lTnVtYmVyIjoiMDkzNDU1MjEwMSIsImlhdCI6MTczMDAzMzMyMywiZXhwIjoxNzMwMDM2OTIzfQ.vIZ4U3JIRFx8xM7kSnL3Akv3WMg_aHOvSEg8A4n9-gk",
    contacts: [1, 3, 34],
  },
  {
    id: 1,
    username: "alawefwefwef",
    firstName: "alaa",
    lastName: "mid",
    gender: "Male",
    phoneNumber: "0934552101",
    image: "http://localhost:3000/uploads/1730033323200.png",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsYXdlZndlZndlZiIsInBob25lTnVtYmVyIjoiMDkzNDU1MjEwMSIsImlhdCI6MTczMDAzMzMyMywiZXhwIjoxNzMwMDM2OTIzfQ.vIZ4U3JIRFx8xM7kSnL3Akv3WMg_aHOvSEg8A4n9-gk",
    contacts: [2, 3, 34],
  },
];



//get user contacts
//get chats with user
//post message {from,to,text,image,voice}
//add contact