// import React, { useState, useEffect, useRef } from "react";
// import { FaMicrophone, FaUpload, FaPaperPlane, FaSearch } from "react-icons/fa";
// import rotbot from "./robot.gif";
// import wat from "./wallapaper.jpeg";
// import anwar from "./phot.jpeg";
// import ali from "./download (4).jpeg";
// import alaa from "./download (5).jpeg";
// import axios from "axios";
// import Fetch from "./fetchLogic";
// const MessagingApp = () => {
//   const [conversations, setConversations] = useState({});
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [currentUser] = useState({
//     name: "Anwar",
//     image: anwar,
//   });
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const chatContainerRef = useRef(null);

//   const users = [
//     { name: "Anwar", image: anwar },
//     { name: "Ali", image: ali },
//     { name: "Alaa", image: alaa },
//   ];

//   useEffect(() => {
//     Fetch.getUserContacts("token").then((data) => {
//       console.log('arrived')
//       console.log(data);
//       // setSelectedUser(data)
//     });

//     if (selectedUser) {
//       fetchMessages(selectedUser.name);
//     }
//   }, [selectedUser]);

//   const fetchMessages = async (username) => {
//     console.log("sdfdsfdsf");

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/messages/${username}`
//       );
//       const messages = response.data;
//       setConversations((prev) => ({
//         ...prev,
//         [username]: messages,
//       }));
//       scrollToBottom();
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const scrollToBottom = () => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   };

//   const handleMessageChange = (event) => {
//     setCurrentMessage(event.target.value);
//   };

//   const sendMessage = async () => {
//     if (currentMessage.trim() === "" && !audioBlob && !uploadedFile) return;

//     const newMessage = {
//       content: currentMessage,
//       status: "pending",
//       file: audioBlob || uploadedFile,
//       sender: currentUser,
//       timestamp: new Date().toISOString(),
//     };

//     // Send the message to the backend
//     try {
//       await axios.post("http://localhost:5000/api/messages", newMessage); // Ensure this endpoint handles saving messages
//       setConversations((prev) => ({
//         ...prev,
//         [selectedUser.name]: [...(prev[selectedUser.name] || []), newMessage],
//       }));
//       setCurrentMessage("");
//       setAudioBlob(null);
//       setUploadedFile(null);
//       setFilePreview(null);
//       scrollToBottom();
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // const startRecording = async () => {
//   //   setIsRecording(true);
//   //   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   //   const recorder = new MediaRecorder(stream);

//   //   recorder.ondataavailable = (event) => {
//   //     setAudioBlob(event.data);
//   //   };

//   //   recorder.start();
//   // };

//   // const stopRecording = () => {
//   //   if (mediaRecorder) {
//   //     mediaRecorder.stop();
//   //     setIsRecording(false);
//   //   }
//   // };

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
//   };

//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer space-x-3">
//         <div className="flex items-center mb-4">
//           <FaSearch className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
//           />
//         </div>
//         <h2 className="text-xl mb-4 font-semibold text-gray-700">Users</h2>
//         <div className="space-y-4">
//           {filteredUsers.length === 0 ? (
//             <div className="text-gray-500">No users found</div>
//           ) : (
//             filteredUsers.map((user, index) => (
//               <div
//                 key={index}
//                 className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded transition duration-200 ${
//                   selectedUser?.name === user.name ? "bg-gray-300" : ""
//                 }`}
//                 onClick={() => handleUserClick(user)}
//               >
//                 <img
//                   src={user.image}
//                   alt={user.name}
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//                 <h3 className="text-lg font-medium text-gray-800">
//                   {user.name}
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
//             <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
//               <div className="flex items-center">
//                 <img
//                   src={selectedUser.image}
//                   alt="Profile"
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//                 <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
//               </div>
//             </div>
//             <div
//               className="flex-1 overflow-y-auto p-4 space-y-4 relative"
//               style={{
//                 backgroundImage: `url(${wat})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 zIndex: 1,
//               }}
//               ref={chatContainerRef}
//             >
//               <div className="bg-opacity-75 p-4 rounded-lg">
//                 {conversations[selectedUser.name]?.map(
//                   (conversation, index) => (
//                     <div
//                       key={index}
//                       className={`flex items-start ${
//                         conversation.sender.name === currentUser.name
//                           ? "justify-end"
//                           : "justify-start"
//                       }`}
//                     >
//                       {conversation.sender.name !== currentUser.name && (
//                         <img
//                           src={conversation.sender.image}
//                           alt="Profile"
//                           className="w-10 h-10 rounded-full mr-2"
//                         />
//                       )}
//                       <div
//                         className={`rounded-lg p-4 max-w-[70%] text-wrap shadow-md transition-all duration-300 ease-in-out ${
//                           conversation.sender.name === currentUser.name
//                             ? "bg-blue-500 text-white"
//                             : "bg-green-300"
//                         }`}
//                         style={{ wordBreak: "break-word" }}
//                       >
//                         <p className="break-words">{conversation.content}</p>
//                         {conversation.file &&
//                           (conversation.file.type.startsWith("audio/") ? (
//                             <audio controls className="mt-2">
//                               <source
//                                 src={URL.createObjectURL(conversation.file)}
//                                 type="audio/wav"
//                               />
//                               Your browser does not support the audio element.
//                             </audio>
//                           ) : (
//                             <img
//                               src={URL.createObjectURL(conversation.file)}
//                               alt="Uploaded"
//                               className="mt-2 w-full h-auto object-cover rounded-md"
//                             />
//                           ))}
//                         <div className="flex items-center mt-2">
//                           {conversation.status === "pending" && (
//                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
//                           )}
//                           <span className="text-gray-600 text-sm">
//                             {new Date(
//                               conversation.timestamp
//                             ).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                       {conversation.sender.name === currentUser.name && (
//                         <img
//                           src={currentUser.image}
//                           alt="Profile"
//                           className="w-10 h-10 rounded-full ml-2"
//                         />
//                       )}
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//             <div className="bg-white py-4 px-6 flex items-center shadow-lg">
//               {filePreview && (
//                 <img
//                   src={filePreview}
//                   alt="Preview"
//                   className="w-16 h-16 rounded-md mr-3"
//                 />
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
//               {currentMessage.trim() || audioBlob || uploadedFile ? (
//                 <button
//                   onClick={sendMessage}
//                   className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200"
//                 >
//                   <FaPaperPlane />
//                 </button>
//               ) : null}
//               <input
//                 id="file-upload"
//                 type="file"
//                 onChange={uploadFile}
//                 className="hidden"
//               />
//               <label htmlFor="file-upload" className="ml-2 cursor-pointer">
//                 <FaUpload className="text-gray-500 hover:text-blue-600 transition duration-200" />
//               </label>
//               {/* {isRecording ? (
//                 <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-4 rounded-full ml-2 hover:bg-red-600 transition duration-200">
//                   Stop
//                 </button>
//               ) : (
//                 <button
//                   onClick={startRecording}
//                   className="bg-white text-blue-600 py-2 px-4 rounded-full ml-2 border border-blue-600 hover:bg-blue-100 transition duration-200"
//                 >
//                   <FaMicrophone />
//                 </button> */}
//               {/* )} */}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessagingApp;
import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaUpload, FaPaperPlane, FaSearch } from "react-icons/fa";
import rotbot from "./robot.gif";
import wat from "./wallapaper.jpeg";
import anwar from "./phot.jpeg";
import axios from "axios";
import Fetch from "./fetchLogic";

const MessagingApp = () => {
  const [conversations, setConversations] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [currentUser] = useState({
    name: "Anwar",
    image: anwar,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]); // State to store users
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Fetch user contacts from API
    Fetch.getUserContacts("token").then((data) => {
      console.log('Fetched users:', data.contacts);
      setUsers(data.contacts); // Set users from API response
    });

    if (selectedUser) {
      fetchMessages(selectedUser.name);
    }
  }, [selectedUser]);

  const fetchMessages = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${username}`);
      const messages = response.data;
      setConversations((prev) => ({
        ...prev,
        [username]: messages,
      }));
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (currentMessage.trim() === "" && !audioBlob && !uploadedFile) return;

    const newMessage = {
      content: currentMessage,
      status: "pending",
      file: audioBlob || uploadedFile,
      sender: currentUser,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5000/api/messages", newMessage);
      setConversations((prev) => ({
        ...prev,
        [selectedUser.name]: [...(prev[selectedUser.name] || []), newMessage],
      }));
      setCurrentMessage("");
      setAudioBlob(null);
      setUploadedFile(null);
      setFilePreview(null);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
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

  const filteredUsers = users.filter((user) =>
    user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  src={user.image || "default_image_url.jpg"} // Fallback for user image
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              <h3 className="text-lg font-medium text-gray-800">
                
             {`${user.firstName} ${user.lastName}`} <br/>
               {user.phoneNumber}
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
                backgroundImage: `url(${wat})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 1,
              }}
              ref={chatContainerRef}
            >
              <div className="bg-opacity-75 p-4 rounded-lg">
                {conversations[selectedUser.name]?.map((conversation, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${
                      conversation.sender.name === currentUser.name
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {conversation.sender.name !== currentUser.name && (
                      <img
                        src={conversation.sender.image || "default_image_url.jpg"} // Fallback
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-2"
                      />
                    )}
                    <div
                      className={`rounded-lg p-4 max-w-[70%] text-wrap shadow-md transition-all duration-300 ease-in-out ${
                        conversation.sender.name === currentUser.name
                          ? "bg-blue-500 text-white"
                          : "bg-green-300"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      <p className="break-words">{conversation.content}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-gray-600 text-sm">
                          {new Date(conversation.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    {conversation.sender.name === currentUser.name && (
                      <img
                        src={currentUser.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full ml-2"
                      />
                    )}
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
              {currentMessage.trim() || audioBlob || uploadedFile ? (
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200"
                >
                  <FaPaperPlane />
                </button>
              ) : null}
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