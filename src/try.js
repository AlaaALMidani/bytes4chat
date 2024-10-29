// import React, { useState, useEffect, useRef } from 'react';
// import { FaMicrophone, FaUpload, FaPaperPlane } from 'react-icons/fa';

// const MessagingApp = () => {
//   const [conversations, setConversations] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [currentUser, setCurrentUser] = useState({
//     name: 'Anwar',
//     image: 'profile1.jpg',
//   });
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [users, setUsers] = useState([
//     { name: 'User 1', image: 'profile1.jpg' },
//     { name: 'User 2', image: 'profile2.jpg' },
//     // Add more users as needed
//   ]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     const webSocket = new WebSocket('ws://your-websocket-url');

//     webSocket.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     webSocket.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       setConversations((prev) => [...prev, message]);
//       scrollToBottom();
//     };

//     webSocket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     webSocket.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     setSocket(webSocket);

//     return () => {
//       webSocket.close();
//     };
//   }, []);

//   const scrollToBottom = () => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   };

//   const handleMessageChange = (event) => {
//     setCurrentMessage(event.target.value);
//   };

//   const sendMessage = () => {
//     if (currentMessage.trim() === '' && !audioBlob && !uploadedFile) return;

//     const newMessage = {
//       content: currentMessage,
//       status: 'pending',
//       file: audioBlob || uploadedFile,
//       sender: currentUser,
//       timestamp: new Date().toISOString(),
//     };

//     setConversations((prev) => [...prev, newMessage]);
//     socket.send(JSON.stringify(newMessage));

//     setCurrentMessage('');
//     setAudioBlob(null);
//     setUploadedFile(null);
//     setFilePreview(null);
//     scrollToBottom();
//   };

//   const startRecording = async () => {
//     setIsRecording(true);
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = (event) => {
//       setAudioBlob(event.data);
//     };

//     recorder.start();
//     setMediaRecorder(recorder);
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//       setMediaRecorder(null);
//     }
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
//     // Fetch conversation history for the selected user and update the UI
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="w-1/3 bg-gray-200 p-4">
//         <h2 className="text-xl mb-4">Users</h2>
//         <div className="space-y-4">
//           {users.map((user, index) => (
//             <div
//               key={index}
//               className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded ${
//                 selectedUser?.name === user.name ? 'bg-gray-300' : ''
//               }`}
//               onClick={() => handleUserClick(user)}
//             >
//               <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
//               <h3 className="text-lg font-medium">{user.name}</h3>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex-1 bg-gray-50 flex flex-col">
//         {selectedUser && (
//           <>
//             <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
//               <div className="flex items-center">
//                 <img src={selectedUser.image} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
//                 <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
//               </div>
//             </div>
//             <div
//               className="flex-1 overflow-y-auto p-4 space-y-4"
//               ref={chatContainerRef}
//             >
//               {conversations
//                 .filter((message) => message.sender.name === selectedUser.name || message.sender.name === currentUser.name)
//                 .map((conversation, index) => (
//                   <div
//                     key={index}
//                     className={`flex items-start ${
//                       conversation.sender.name === currentUser.name ? 'justify-end' : ''
//                     }`}
//                   >
//                     {conversation.sender.name !== currentUser.name && (
//                       <img
//                         src={conversation.sender.image}
//                         alt="Profile"
//                         className="w-10 h-10 rounded-full mr-2"
//                       />
//                     )}
//                     <div
//                       className={`rounded-lg p-4 max-w-[60%] text-wrap shadow-md transition-all duration-300 ease-in-out ${
//                         conversation.sender.name === currentUser.name
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-green-300'
//                       }`}
//                     >
//                       <p className="break-words">{conversation.content}</p>
//                       {conversation.file && (
//                         conversation.file.type.startsWith('audio/') ? (
//                           <audio controls className="mt-2">
//                             <source src={URL.createObjectURL(conversation.file)} type="audio/wav" />
//                             Your browser does not support the audio element.
//                           </audio>
//                         ) : (
//                           <img
//                             src={URL.createObjectURL(conversation.file)}
//                             alt="Uploaded"
//                             className="mt-2 w-full h-auto object-cover rounded-md"
//                           />
//                         )
//                       )}
//                       <div className="flex items-center mt-2">
//                         {conversation.status === 'pending' && (
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
//                         )}
//                         <span className="text-gray-600 text-sm">
//                           {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </span>
//                       </div>
//                     </div>
//                     {conversation.sender.name === currentUser.name && (
//                       <img
//                         src={conversation.sender.image}
//                         alt="Profile"
//                         className="w-10 h-10 rounded-full ml-2"
//                       />
//                     )}
//                   </div>
//                 ))}
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
//                   if (e.key === 'Enter') {
//                     sendMessage();
//                   }
//                 }}
//               />
//               {currentMessage.trim() || audioBlob || uploadedFile ? (
//                 <button onClick={sendMessage} className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200">
//                   <FaPaperPlane />
//                 </button>
//               ) : null}
//               <input id="file-upload" type="file" onChange={uploadFile} className="hidden" />
//               <label htmlFor="file-upload" className="ml-2 cursor-pointer">
//                 <FaUpload className="text-gray-500 hover:text-blue-600 transition duration-200" />
//               </label>
//               {isRecording ? (
//                 <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-4 rounded-full ml-2 hover:bg-red-600 transition duration-200">
//                   Stop
//                 </button>
//               ) : (
//                 <button
//                   onClick={startRecording}
//                   className="bg-white text-blue-600 py-2 px-4 rounded-full ml-2 border border-blue-600 hover:bg-blue-100 transition duration-200"
//                 >
//                   <FaMicrophone />
//                 </button>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessagingApp;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaMicrophone, FaUpload } from 'react-icons/fa';
// // import backgroundImage from './wallapaper.jpeg';

// const MessagingApp = () => {
//   const [conversations, setConversations] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [currentUser] = useState({
//     name: 'Anwar',
//     image: 'profile1.jpg',
//   });
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const webSocket = new WebSocket('ws://your-websocket-url');

//     webSocket.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     webSocket.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       setConversations((prev) => [...prev, message]);
//     };

//     webSocket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     webSocket.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     setSocket(webSocket);

//     return () => {
//       webSocket.close();
//     };
//   }, []);

//   const handleMessageChange = (event) => {
//     setCurrentMessage(event.target.value);
//   };

//   const sendMessage = () => {
//     if (currentMessage.trim() === '' && !audioBlob && !uploadedFile) return;

//     const newMessage = {
//       content: currentMessage,
//       status: 'pending',
//       file: audioBlob || uploadedFile,
//       sender: currentUser,
//       timestamp: new Date().toISOString(),
//     };

//     setConversations((prev) => [...prev, newMessage]);

//     socket.send(JSON.stringify(newMessage));

//     setCurrentMessage('');
//     setAudioBlob(null);
//     setUploadedFile(null);
//     setFilePreview(null);
//   };

//   const startRecording = async () => {
//     setIsRecording(true);
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = (event) => {
//       setAudioBlob(event.data);
//     };

//     recorder.start();
//     setMediaRecorder(recorder);
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//       setMediaRecorder(null);
//     }
//   };

//   const uploadFile = (event) => {
//     const selectedFile = event.target.files[0];
//     setUploadedFile(selectedFile);

//     if (selectedFile) {
//       setFilePreview(URL.createObjectURL(selectedFile));
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen overflow-hidden">
//       <div className="bg-blue-500 text-white py-3 px-4 flex justify-between items-center">
//         <div className="flex items-center">
//           <img src={currentUser.image} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
//           <h1 className="text-lg font-bold">{currentUser.name}</h1>
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4 flex flex-col">
//         {conversations.map((conversation, index) => (
//           <div
//             key={index}
//             className={`flex items-start mb-4 ${conversation.sender.name === currentUser.name ? 'justify-end' : ''}`}
//           >
//             {conversation.sender.name !== currentUser.name && (
//               <img
//                 src={conversation.sender.image}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full mr-2"
//               />
//             )}
//             <div
//               className={`bg-green-300 rounded-lg p-3 max-w-[50%] text-wrap ${conversation.sender.name === currentUser.name ? 'bg-blue-500 text-white' : ''}`}
//             >
//               <p className="break-words">{conversation.content}</p>
//               {conversation.file && (
//                 conversation.file.type.startsWith('audio/') ? (
//                   <audio controls>
//                     <source src={URL.createObjectURL(conversation.file)} type="audio/wav" />
//                     Your browser does not support the audio element.
//                   </audio>
//                 ) : (
//                   <img
//                     src={URL.createObjectURL(conversation.file)}
//                     alt="Uploaded"
//                     className="mt-2 w-full h-auto object-cover rounded-md"
//                   />
//                 )
//               )}
//               <div className="flex items-center mt-2">
//                 {conversation.status === 'pending' && (
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
//                 )}
//                 <span className="text-gray-500 text-sm">
//                   {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </span>
//               </div>
//             </div>
//             {conversation.sender.name === currentUser.name && (
//               <img
//                 src={conversation.sender.image}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full ml-2"
//               />
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="bg-gray-200 py-2 px-4 flex items-center">
//         {filePreview && (
//           <img
//             src={filePreview}
//             alt="Preview"
//             className="w-16 h-16 rounded-md mr-2"
//           />
//         )}
//         <input
//           type="text"
//           value={currentMessage}
//           onChange={handleMessageChange}
//           className="flex-1 py-2 px-3 rounded-full mr-2"
//           placeholder="Type your message..."
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               sendMessage();
//             }
//           }}
//         />
//         {currentMessage.trim() || audioBlob || uploadedFile ? (
//           <button onClick={sendMessage} className="bg-blue-500 text-white py-2 px-4 rounded-full mr-2">
//             Send
//           </button>
//         ) : null}
//         <input id="file-upload" type="file" onChange={uploadFile} className="hidden" />
//         <label htmlFor="file-upload" className="mr-2 cursor-pointer">
//           <FaUpload className="text-gray-500" />
//         </label>
//         {isRecording ? (
//           <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-4 rounded-full">
//             Stop
//           </button>
//         ) : (
//           <button
//             onClick={startRecording}
//             className="bg-white text-blue-500 py-2 px-4 rounded-full"
//           >
//             <FaMicrophone />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessagingApp;
// import React, { useState, useEffect, useRef } from 'react';
// import { FaMicrophone, FaUpload, FaPaperPlane } from 'react-icons/fa';
// import rotbot from './robot.gif';
// import wat from './wallapaper.jpeg';

// const MessagingApp = () => {
//   const [conversations, setConversations] = useState({});
//   const [currentMessage, setCurrentMessage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);
//   const [currentUser] = useState({
//     name: 'Anwar',
//     image: 'profile1.jpg',
//   });
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [users] = useState([
//     { name: 'User 1', image: 'profile1.jpg' },
//     { name: 'User 2', image: 'profile2.jpg' },
//   ]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     const webSocket = new WebSocket('url');

//     webSocket.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     webSocket.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       updateConversations(message);
//       scrollToBottom();
//     };

//     webSocket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     webSocket.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     setSocket(webSocket);

//     return () => {
//       webSocket.close();
//     };
//   }, []);

//   const updateConversations = (message) => {
//     setConversations((prevConversations) => {
//       const updatedConversations = { ...prevConversations };
//       const { sender } = message;
//       if (!updatedConversations[sender.name]) {
//         updatedConversations[sender.name] = [];
//       }
//       updatedConversations[sender.name].push(message);
//       return updatedConversations;
//     });
//   };

//   const scrollToBottom = () => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   };

//   const handleMessageChange = (event) => {
//     setCurrentMessage(event.target.value);
//   };

//   const sendMessage = () => {
//     if (currentMessage.trim() === '' && !audioBlob && !uploadedFile) return;

//     const newMessage = {
//       content: currentMessage,
//       status: 'pending', // Set status to pending immediately
//       file: audioBlob || uploadedFile,
//       sender: currentUser,
//       timestamp: new Date().toISOString(),
//     };

//     // Update the local state with the new message
//     updateConversations(newMessage);

//     // Check if the WebSocket is open before sending
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(newMessage));
//     } else {
//       console.error("WebSocket is not open. Message not sent.");
//     }

//     setCurrentMessage('');
//     setAudioBlob(null);
//     setUploadedFile(null);
//     setFilePreview(null);
//     scrollToBottom();
//   };

//   const startRecording = async () => {
//     setIsRecording(true);
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = (event) => {
//       setAudioBlob(event.data);
//     };

//     recorder.start();
//     setMediaRecorder(recorder);
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//       setMediaRecorder(null);
//     }
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
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="w-1/3 bg-slate-400 p-4">
//         <h2 className="text-xl mb-4">Users</h2>
//         <div className="space-y-4">
//           {users.map((user, index) => (
//             <div
//               key={index}
//               className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded ${
//                 selectedUser?.name === user.name ? 'bg-gray-300' : ''
//               }`}
//               onClick={() => handleUserClick(user)}
//             >
//               <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
//               <h3 className="text-lg font-medium">{user.name}</h3>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex-1 bg-gray-50 flex flex-col">
//         {!selectedUser && <img src={rotbot} alt="Robot" />}
//         {selectedUser && (
//           <>
//             <div className="bg-blue-600 text-white py-4 px-6 flex items-center shadow-lg">
//               <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
//               <img src={wat} className='w-full h-full' alt="Background" />
//               {conversations[selectedUser.name]?.map((conversation, index) => (
//                 <div
//                   key={index}
//                   className={`flex items-start ${
//                     (conversation.sender.name === currentUser.name || conversation.status === 'pending') ? 'justify-start' : 'justify-end'
//                   }`}
//                 >
//                   {conversation.sender.name !== currentUser.name && (
//                     <img
//                       src={conversation.sender.image}
//                       alt="Profile"
//                       className="w-10 h-10 rounded-full mr-2"
//                     />
//                   )}
//                   <div
//                     className={`rounded-lg p-4 max-w-[60%] text-wrap shadow-md transition-all duration-300 ease-in-out ${
//                       conversation.sender.name === currentUser.name
//                         ? 'bg-blue-500 text-white'
//                         : 'bg-green-300'
//                     }`}
//                   >
//                     <p className="break-words">{conversation.content}</p>
//                     {conversation.file && (
//                       conversation.file.type.startsWith('audio/') ? (
//                         <audio controls className="mt-2">
//                           <source src={URL.createObjectURL(conversation.file)} type="audio/wav" />
//                           Your browser does not support the audio element.
//                         </audio>
//                       ) : (
//                         <img
//                           src={URL.createObjectURL(conversation.file)}
//                           alt="Uploaded"
//                           className="mt-2 w-full h-auto object-cover rounded-md"
//                         />
//                       )
//                     )}
//                     <div className="flex items-center mt-2">
//                       {conversation.sender.name === currentUser.name && conversation.status === 'pending' && (
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
//                       )}
//                       <span className="text-gray-600 text-sm">
//                         {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </div>
//                   </div>
//                   {conversation.sender.name === currentUser.name && (
//                     <img
//                       src={conversation.sender.image}
//                       alt="Profile"
//                       className="w-10 h-10 rounded-full ml-2"
//                     />
//                   )}
//                 </div>
//               ))}
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
//                   if (e.key === 'Enter') {
//                     sendMessage();
//                   }
//                 }}
//               />
//               {currentMessage.trim() || audioBlob || uploadedFile ? (
//                 <button onClick={sendMessage} className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200">
//                   <FaPaperPlane />
//                 </button>
//               ) : null}
//               <input id="file-upload" type="file" onChange={uploadFile} className="hidden" />
//               <label htmlFor="file-upload" className="ml-2 cursor-pointer">
//                 <FaUpload className="text-gray-500 hover:text-blue-600 transition duration-200" />
//               </label>
//               {isRecording ? (
//                 <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-4 rounded-full ml-2 hover:bg-red-600 transition duration-200">
//                   Stop
//                 </button>
//               ) : (
//                 <button
//                   onClick={startRecording}
//                   className="bg-white text-blue-600 py-2 px-4 rounded-full ml-2 border border-blue-600 hover:bg-blue-100 transition duration-200"
//                 >
//                   <FaMicrophone />
//                 </button>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessagingApp;
import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaUpload, FaPaperPlane, FaArrowLeft } from 'react-icons/fa'; 
import rotbot from './robot.gif';
import wat from './wallapaper.jpeg';
import anwar from './phot.jpeg';
import ali from './download (4).jpeg';
import alaa from './download (5).jpeg';
import Sidebar from './SideBar';

const MessagingApp = () => {
  const [conversations, setConversations] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [currentUser] = useState({
    name: 'Anwar',
    image: anwar,
  });
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [socket, setSocket] = useState(null);
  const [selectedUser] = useState({ name: 'Ali', image: ali });
  const [isChatActive, setIsChatActive] = useState(false);
  const chatContainerRef = useRef(null);

  // Track screen width
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const webSocket = new WebSocket('url'); 

    webSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setConversations((prev) => ({
        ...prev,
        [message.sender.name]: [...(prev[message.sender.name] || []), message],
      }));
      scrollToBottom();
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(webSocket);
    
    return () => {
      webSocket.close();
    };
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  const sendMessage = () => {
    if (currentMessage.trim() === '' && !audioBlob && !uploadedFile) return;

    const newMessage = {
      content: currentMessage,
      status: 'pending',
      file: audioBlob || uploadedFile,
      sender: currentUser,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) => ({
      ...prev,
      [selectedUser.name]: [...(prev[selectedUser.name] || []), newMessage],
    }));

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(newMessage));
    } else {
      console.warn('WebSocket is not open. Message not sent.');
    }

    setCurrentMessage('');
    setAudioBlob(null);
    setUploadedFile(null);
    setFilePreview(null);
    scrollToBottom();
  };

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      setAudioBlob(event.data);
    };

    recorder.start();
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const uploadFile = (event) => {
    const selectedFile = event.target.files[0];
    setUploadedFile(selectedFile);

    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSelectConversation = (user) => {
    setIsChatActive(true);
  };

  const showSidebar = () => {
    setIsChatActive(false);
    setSidebarVisible(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Render Sidebar only if not mobile (screen width > 900px) */}
      {sidebarVisible && (
        <div className="bg-gray-800 w-1/3 h-screen p-5">
          <Sidebar onSelectConversation={handleSelectConversation} />
        </div>
      )}
      <div className={`flex-1 bg-white flex flex-col relative ${isChatActive ? 'opacity-100' : 'opacity-80'}`}>
        {!selectedUser ? (
          <div className="flex justify-center items-center flex-grow">
            <img src={rotbot} alt="Robot" className="w-1/2" />
          </div>
        ) : (
          <>
            <div className="bg-green-700 text-white py-4 px-6 flex justify-between items-center shadow-lg">
              <div className="flex items-center">
                <img src={selectedUser.image} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
              </div>
              {/* Show Back Button only on mobile */}
              {isMobile && (
                <button
                  onClick={showSidebar}
                  className="bg-blue-600 text-white py-2 px-4 rounded-full flex items-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
              )}
            </div>
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 relative"
              style={{
                backgroundImage: `url(${wat})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
              }}
              ref={chatContainerRef}
            >
              <div className="bg-opacity-75 p-4 rounded-lg">
                {conversations[selectedUser.name]?.map((conversation, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${
                      conversation.sender.name === currentUser.name ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {conversation.sender.name !== currentUser.name && (
                      <img
                        src={conversation.sender.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-2"
                      />
                    )}
                    <div
                      className={`rounded-lg p-4 max-w-[70%] text-wrap shadow-md transition-all duration-300 ease-in-out ${
                        conversation.sender.name === currentUser.name
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-300'
                      }`}
                      style={{ wordBreak: 'break-word' }} 
                    >
                      <p className="break-words">{conversation.content}</p>
                      {conversation.file && (
                        conversation.file.type.startsWith('audio/') ? (
                          <audio controls className="mt-2">
                            <source src={URL.createObjectURL(conversation.file)} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          <img
                            src={URL.createObjectURL(conversation.file)}
                            alt="Uploaded"
                            className="mt-2 w-full h-auto object-cover rounded-md"
                          />
                        )
                      )}
                      <div className="flex items-center mt-2">
                        {conversation.status === 'pending' && (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                        )}
                        <span className="text-gray-600 text-sm">
                          {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              {currentMessage.trim() || audioBlob || uploadedFile ? (
                <button onClick={sendMessage} className="text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200">
                  <FaPaperPlane />
                </button>
              ) : null}
              <input id="file-upload" type="file" onChange={uploadFile} className="hidden" />
              <label htmlFor="file-upload" className="ml-2 cursor-pointer">
                <FaUpload className="text-gray-500 hover:text-blue-600 transition duration-200" />
              </label>
              {isRecording ? (
                <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-4 rounded-full ml-2 hover:bg-red-600 transition duration-200">
                  Stop
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="bg-white text-blue-600 py-2 px-4 rounded-full ml-2 border border-blue-600 hover:bg-blue-100 transition duration-200"
                >
                  <FaMicrophone />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingApp;