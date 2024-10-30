
// import React, { useState, useEffect, useRef } from "react";
// import { FaUpload, FaPaperPlane, FaSearch, FaClock, FaCheck, FaCheckDouble } from "react-icons/fa";
// import rotbot from "./robot.gif";
// import anwar from "./phot.jpeg";
// import axios from "axios";
// import Fetch from "./fetchLogic";
// import io from "socket.io-client";

// const MessagingApp = () => {
//   const [conversations, setConversations] = useState({});
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [currentUser] = useState({
//     name: "Anwar",
//     image: anwar,
//     id: 1,
//   });
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const chatContainerRef = useRef(null);
//   const MAX_WORDS = 10;

//   useEffect(() => {
//     Fetch.getUserContacts("token").then((data) => {
//       setUsers(data.contacts);
//       console.log(data);
//     });

//     if (selectedUser) {
//       fetchMessages(selectedUser.from);
//     }
//     const socketInstance = io('https://eec9-212-8-253-146.ngrok-free.app/'); 
//     socketInstance.on('receiveMessage', (message) => {
//       if (message.to === currentUser.id) {
//         setConversations((prev) => ({
//           ...prev,
//           [message.from]: [...(prev[message.from] || []), message],
//         }));
//       }
//     });

//     return () => {
//       socketInstance.disconnect(); // Cleanup on unmount
//     };
//   }, [selectedUser]);

//   const fetchMessages = async (userId) => {
//     try {
//       const response = await axios.get(`https://eec9-212-8-253-146.ngrok-free.app/messages?userId=${userId}`);
//       const messages = response.data;
//       setConversations((prev) => ({
//         ...prev,
//         [userId]: messages,
//       }));
//       scrollToBottom();
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const scrollToBottom = () => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   };

//   const handleMessageChange = (event) => {
//     setCurrentMessage(event.target.value);
//   };

//   const sendMessage = async () => {
//     const trimmedMessage = currentMessage.trim();

//     if (trimmedMessage === "" && !uploadedFile) return;

//     const messageId = Date.now();
//     const message = {
//       id: messageId,
//       content: trimmedMessage,
//       to: selectedUser.from,
//       from: currentUser.id,
//       timestamp: new Date().toISOString(),
//       file: uploadedFile || null,
//       status: "pending",
//       showFull: false,
//     };

//     setConversations((prev) => ({
//       ...prev,
//       [selectedUser.from]: [...(prev[selectedUser.from] || []), message],
//     }));

//     try {
//       await socketInstance.emit("sendMessage", message);
//       updateMessageStatus(messageId, "sent");
//     } catch (error) {
//       console.error("Message sending failed:", error);
//     }

//     setCurrentMessage("");
//     setUploadedFile(null);
//     setFilePreview(null);
//     scrollToBottom();
//   };

//   const updateMessageStatus = (messageId, status) => {
//     setConversations((prev) => {
//       const updatedConvo = prev[selectedUser.from].map((msg) => {
//         if (msg.id === messageId) {
//           return { ...msg, status };
//         }
//         return msg;
//       });
//       return { ...prev, [selectedUser.from]: updatedConvo };
//     });
//   };

//   const uploadFile = (event) => {
//     const selectedFile = event.target.files[0];
//     setUploadedFile(selectedFile);

//     if (selectedFile) {
//       setFilePreview(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleUserClick = (user) => {
//     setSelectedUser(user);
//     setCurrentMessage("");
//     scrollToBottom();
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return <FaClock className="text-gray-400" />;
//       case "sent":
//         return <FaCheck className="text-gray-400" />;
//       case "delivered":
//         return <FaCheckDouble className="text-gray-400" />;
//       case "read":
//         return <FaCheckDouble className="text-blue-600" />;
//       default:
//         return null;
//     }
//   };

//   const toggleReadMore = (id) => {
//     setConversations((prev) => {
//       const updatedConvo = prev[selectedUser.from].map((msg) => {
//         if (msg.id === id) {
//           return { ...msg, showFull: !msg.showFull };
//         }
//         return msg;
//       });
//       return { ...prev, [selectedUser.from]: updatedConvo };
//     });
//   };

//   const formatMessage = (message) => {
//     const words = message.split(" ");
//     const isLongMessage = words.length > MAX_WORDS;

//     if (isLongMessage && !message.showFull) {
//       return words.slice(0, MAX_WORDS).join(" ") + "...";
//     }
//     return message;
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer space-x-3">
//         <div className="flex items-center mb-4">
//           <FaSearch className="text-gray-500 mr-2" />
//           <input type="text" placeholder="Search users..." className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500" />
//         </div>
//         <h2 className="text-xl mb-4 font-semibold text-gray-700">Users</h2>
//         <div className="space-y-4">
//           {users.length === 0 ? (
//             <div className="text-gray-500">No users found</div>
//           ) : (
//             users.map((user, index) => (
//               <div
//                 key={index}
//                 className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded transition duration-200 ${selectedUser?.name === user.name ? "bg-gray-300" : ""}`}
//                 onClick={() => handleUserClick(user)}
//               >
//                 <img
//                   src={user.image || "default_image_url.jpg"}
//                   alt={user.name}
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//                 <h3 className="text-lg font-medium text-gray-800">
//                   {`${user.firstName} ${user.lastName}`} <br />
//                 {user.massages[user.massages.length-1].text}
//                 </h3>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       <div className="flex-1 bg-white flex flex-col relative">
//         {!selectedUser ? (
//           <div className="flex justify-center items-center flex-grow">
//             <img src={rotbot} alt="Robot" className="w-1/2 opacity-50" />
//           </div>
//         ) : (
//           <>
//             <div className="bg-blue-600 text-white py-4 px-6 flex items-center shadow-lg">
//               <img src={selectedUser.image} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
//               <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 relative" ref={chatContainerRef}>
//               <div className="bg-opacity-75 p-4 rounded-lg">
//                 {
//                 selectedUser.massages?.map((message, index) => {
//                   console.log(message)
//                   const isCurrentUser = message.sender === currentUser.from;
//                   const userImage = isCurrentUser ? currentUser.image : selectedUser.image;

//                   return (
//                     <div key={index} className={`flex items-start ${isCurrentUser ? "justify-end" : "justify-start"}`}>
//                       {!isCurrentUser && (
//                         <img src={userImage || "default_image_url.jpg"} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
//                       )}
//                       <div className={`rounded-lg p-4 max-w-[70%] shadow-md transition-all duration-300 ease-in-out ${isCurrentUser ? "bg-blue-500 text-white" : "bg-green-300"}`}>
//                         <p className={`break-words ${message.showFull ? "" : "line-clamp-2"}`}>
      
//                           {formatMessage(message.content)}
//                         </p>
//                         <p>{message.text}</p>
//                         {message.content.split(" ").length > MAX_WORDS && (
//                           <span 
//                             onClick={() => toggleReadMore(message.id)} 
//                             className="text-blue-500 cursor-pointer mt-1">
//                             {message.showFull ? "Show less" : "Read more"}
//                           </span>
//                         )}
//                         {message.file && (
//                           <div className="mt-2">
//                             {message.file.type.startsWith("image/") ? (
//                               <img src={URL.createObjectURL(message.file)} alt="Attached file" className="max-w-full h-auto rounded-md" />
//                             ) : (
//                               <a href={URL.createObjectURL(message.file)} download className="text-blue-500 hover:underline">
//                                 {message.file.name}
//                               </a>
//                             )}
//                           </div>
//                         )}
//                         <div className="flex items-center mt-2">
//                           <span className="text-gray-600 text-sm">
//                             {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                           </span>
//                           <span className="ml-2">{getStatusIcon(message.status)}</span>
//                         </div>
//                       </div>
//                       {isCurrentUser && (
//                         <img src={currentUser.image} alt="Profile" className="w-10 h-10 rounded-full ml-2" />
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className="bg-white py-4 px-6 flex items-center shadow-lg">
//               {filePreview && (
//                 <img src={filePreview} alt="Preview" className="w-16 h-16 rounded-md mr-3" />
//               )}
//               <input
//                 type="text"
//                 value={currentMessage}
//                 onChange={handleMessageChange}
//                 className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
//                 placeholder="Type your message..."
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     sendMessage();
//                   }
//                 }}
//               />
//               {(currentMessage.trim() || uploadedFile) && (
//                 <button onClick={sendMessage} className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200">
//                   <FaPaperPlane />
//                 </button>
//               )}
//               <input id="file-upload" type="file" onChange={uploadFile} className="hidden" />
//               <label htmlFor="file-upload" className="ml-2 cursor-pointer">
//                 <FaUpload className="text-gray-500 hover:text-blue-600 transition duration-200" />
//               </label>
//             </div>
//           </>
//         )}
//       </div>
//       <div className="absolute bottom-0 left-14 p-4 flex items-center bg-white shadow-lg rounded-lg">
//         <img src={currentUser.image} alt="User Profile" className="w-10 h-10 rounded-full mr-2" />
//         <span className="text-lg font-semibold text-gray-800">{currentUser.name}</span>
//       </div>
//     </div>
//   );
// };

// export default MessagingApp;
import React, { useState, useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaUpload,
  FaPaperPlane,
  FaSearch,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";
import rotbot from "./robot.gif";
import wat from "./wallapaper.jpeg";
import anwar from "./phot.jpeg";
import axios from "axios";
import Fetch from "./fetchLogic";
import io from 'socket.io-client';

const MessagingApp = () => {
  const [conversations, setConversations] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [currentUser] = useState({
    name: "Anwar",
    image: anwar,
    id: 1, 
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const chatContainerRef = useRef(null);

  const socket = io.connect("https://ee8f-5-155-171-224.ngrok-free.app");
  
  socket.emit("join", 1);
  useEffect(() => {
    Fetch.getUserContacts("token").then((data) => {
      setUsers(data.contacts);
      console.log(data)
    });
    socket.emit("privateMessage", 3, 'token', {
      from: 2,
      to: 1,
      text: "hi how are you ",
      image: null,
      voice: null,
      time: 22323,
    });
    if (selectedUser) {
      fetchMessages(selectedUser.name);
    }
  }, [selectedUser]);
//   useEffect(() => {
//     socket.current = io("your_socket_server_url");

//     Fetch.getUserContacts("token").then((data) => {
//       setUsers(data.contacts);
//     });

//     return () => {
//       socket.current.disconnect(); 
//     };
//   }, []);
  const fetchMessages = async (username) => {
    // try {
    //   const response = await axios.get(
    //     `http://localhost:5000/api/messages/${username}`
    //   );
    //   const messages = response.data;
    //   setConversations((prev) => ({
    //     ...prev,
    //     [username]: messages,
    //   }));
    //   scrollToBottom();
    // } catch (error) {
    //   console.error("Error fetching messages:", error);
    // }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };
  const sendMessage = async () => {
        const trimmedMessage = currentMessage.trim();
    
        if (trimmedMessage === "" && !uploadedFile) return;
    
        const messageId = Date.now(); // Unique ID for message
        const message = {
          id: messageId,
          contacts: message.text,
          sender: currentUser.message.from,
          from: currentUser.name,
          to: selectedUser.name,
          
          timestamp: new Date().toISOString(),
          file: uploadedFile || null,
          status: "pending", 
          showFull: false, 
        };
    console.log(message)
        setConversations((prev) => ({
          ...prev,
          [selectedUser.name]: [
            ...(prev[selectedUser.name] || []),
            message,
          ],
        }));
    
        try {
          await socket.current.emit("sendMessage", message);
          updateMessageStatus(messageId, "sent");
        } catch (error) {
          console.error("Message sending failed:", error);
        }
    
        setCurrentMessage("");
        setUploadedFile(null);
        setFilePreview(null);
        scrollToBottom();
      };
  const uploadFile = (event) => {
    const selectedFile = event.target.files[0];
    setUploadedFile(selectedFile);

    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setCurrentMessage("");
  };

  const getStatusIcon = (status) => {
    if (status === "sent") return <FaCheck className="text-gray-400" />;
    if (status === "delivered")
      return <FaCheckDouble className="text-gray-400" />;
    if (status === "read") return <FaCheckDouble className="text-blue-500" />;
    return null;
  };
  const updateMessageStatus = (messageId, status) => {
        setConversations((prev) => {
          const updatedConvo = prev[selectedUser.from].map((msg) => {
            if (msg.id === messageId) {
              return { ...msg, status };
            }
            return msg;
          });
          return { ...prev, [selectedUser.from]: updatedConvo };
        });
      };
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer space-x-3">
        <div className="flex items-center mb-4">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <h2 className="text-xl mb-4 font-semibold text-gray-700">Users</h2>
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-gray-500">No users found</div>
          ) : (
            users.map((user, index) => (
              <div
                key={index}
                className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded transition duration-200 ${
                  selectedUser?.name === user.name ? "bg-gray-300" : ""
                }`}
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.image || "default_image_url.jpg"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h3 className="text-lg font-medium text-gray-800">
                  {`${user.firstName} ${user.lastName}`} <br />
                
                </h3>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex-1 bg-white flex flex-col relative">
        {!selectedUser ? (
          <div className="flex justify-center items-center flex-grow">
            <img src={rotbot} alt="Robot" className="w-1/2 opacity-50" />
          </div>
        ) : (
          <>
            <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
              <div className="flex items-center">
                <img
                  src={selectedUser.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
              </div>
            </div>
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 relative"
              style={{
                // backgroundImage: `url(${wat})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 1,
              }}
              ref={chatContainerRef}
            >
              <div className="bg-opacity-75 p-4 rounded-lg">
                {conversations[selectedUser.name]?.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${
                      message.sender === currentUser.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender !== currentUser.id && (
                      <img
                        src={selectedUser.image || "default_image_url.jpg"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-2"
                      />
                    )}
                    <div
                      className={`rounded-lg p-4 max-w-[70%] text-wrap shadow-md transition-all duration-300 ease-in-out ${
                        message.sender === currentUser.id
                          ? "bg-blue-500 text-white"
                          : "bg-green-300"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                     <p className="break-words">{message.content}</p>
              
                {message.text && (
                  <p className="mt-1 text-sm text-gray-600">{message.text}</p>
                )}
                      {message.file && (
                        <div className="mt-2">
                          {message.file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(message.file)} // Create an object URL for images
                              alt="Attached file"
                              className="max-w-full h-auto rounded-md"
                            />
                          ) : (
                            <a
                              href={URL.createObjectURL(message.file)} // Create an object URL for other files
                              download 
                              className="text-blue-500 hover:underline"
                            >
                              {message.file.name}
                            </a>
                          )}
                        </div>
                      )}
                      <div className="flex items-center mt-2">
                        <span className="text-gray-600 text-sm">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="ml-2">
                          {getStatusIcon(message.status)}
                        </span>
                      </div>
                    </div>
                    {message.sender === currentUser.id && (
                      <img
                        src={currentUser.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full ml-2"
                      />
                    )}
                  {users.map((user, index) => (
                          <p key={index}> {user.messages[0].text} </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white py-4 px-6 flex items-center shadow-lg">
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-md mr-3"
                />
              )}
              <input
                type="text"
                value={currentMessage}
                onChange={handleMessageChange}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              {(currentMessage.trim() || audioBlob || uploadedFile) && (
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200"
                >
                  <FaPaperPlane />
                </button>
              )}
              <input
                id="file-upload"
                type="file"
                onChange={uploadFile}
                className="hidden"
              />
              <label htmlFor="file-upload" className="ml-2 cursor-pointer">
                <FaUpload className="text-gray-500 hover:text-blue-600 transition duration-200" />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingApp;