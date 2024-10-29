// import React, { useState, useEffect, useRef } from 'react';
// import { FaMicrophone, FaUpload, FaPaperPlane } from 'react-icons/fa';
// import Sidebar from './Sidebar';

// const MessagingApp = () => {
//     const [currentMessage, setCurrentMessage] = useState('');
//     const [isRecording, setIsRecording] = useState(false);
//     const [audioBlob, setAudioBlob] = useState(null);
//     const [uploadedFile, setUploadedFile] = useState(null);
//     const [filePreview, setFilePreview] = useState(null);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const chatContainerRef = useRef(null);

//     const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 900);
//         };

//         window.addEventListener('resize', handleResize);
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     const scrollToBottom = () => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     };

//     const handleMessageChange = (event) => {
//         setCurrentMessage(event.target.value);
//     };

//     const sendMessage = () => {
//         if (currentMessage.trim() === '' && !audioBlob && !uploadedFile) return;

//         // هنا يمكنك إضافة المنطق لإرسال الرسالة
//         console.log('Message sent:', currentMessage, audioBlob, uploadedFile);

//         setCurrentMessage('');
//         setAudioBlob(null);
//         setUploadedFile(null);
//         setFilePreview(null);
//         scrollToBottom();
//     };

//     const startRecording = async () => {
//         setIsRecording(true);
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const recorder = new MediaRecorder(stream);

//         recorder.ondataavailable = (event) => {
//             setAudioBlob(event.data);
//         };

//         recorder.start();
//     };

//     const stopRecording = () => {
//         setIsRecording(false);
//     };

//     const uploadFile = (event) => {
//         const selectedFile = event.target.files[0];
//         setUploadedFile(selectedFile);

//         if (selectedFile) {
//             setFilePreview(URL.createObjectURL(selectedFile));
//         }
//     };

//     const handleSelectConversation = (user) => {
//         setSelectedUser(user);
//     };

//     return (
//         <div className="flex h-screen bg-gray-100">
//             <Sidebar onSelectConversation={handleSelectConversation} />
//             <div className="flex-1 bg-white flex flex-col relative">
//                 {!selectedUser ? (
//                     <div className="flex justify-center items-center flex-grow">
//                         <p>Select a conversation to start chatting!</p>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="bg-green-700 text-white py-4 px-6 flex items-center shadow-lg">
//                             <img src={selectedUser.avatar} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
//                             <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
//                         </div>
//                         <div
//                             className="flex-1 overflow-y-auto p-4 space-y-4"
//                             ref={chatContainerRef}
//                         >
//                             {/* هنا يمكنك إضافة الرسائل الخاصة بالمستخدم المحدد */}
//                         </div>
//                         <div className="bg-white py-4 px-6 flex items-center shadow-lg">
//                             {filePreview && (
//                                 <img
//                                     src={filePreview}
//                                     alt="Preview"
//                                     className="w-16 h-16 rounded-md mr-3"
//                                 />
//                             )}
//                             <input
//                                 type="text"
//                                 value={currentMessage}
//                                 onChange={handleMessageChange}
//                                 className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
//                                 placeholder="Type your message..."
//                                 onKeyDown={(e) => {
//                                     if (e.key === 'Enter') {
//                                         sendMessage();
//                                     }
//                                 }}
//                             />
//                             {currentMessage.trim() || audioBlob || uploadedFile ? (
//                                 <button onClick={sendMessage} className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200">
//                                     <FaPaperPlane />
//                                 </button>
//                             ) : null}
//                             <input id="file-upload" type="file" onChange={uploadFile} className="hidden" />
//                             <label htmlFor="file-upload" className="ml-2 cursor-pointer">
//                                 <FaUpload className="text-gray-500 hover:text-blue-600 transition duration-200" />
//                             </label>
//                             {isRecording ? (
//                                 <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-4 rounded-full ml-2 hover:bg-red-600 transition duration-200">
//                                     Stop
//                                 </button>
//                             ) : (
//                                 <button
//                                     onClick={startRecording}
//                                     className="bg-white text-blue-600 py-2 px-4 rounded-full ml-2 border border-blue-600 hover:bg-blue-100 transition duration-200"
//                                 >
//                                     <FaMicrophone />
//                                 </button>
//                             )}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MessagingApp;










import React, { useState } from 'react';
import Sidebar from './Sidebar'; // تأكد من المسار الصحيح لمكون Sidebar

const MessagingApp = () => {
    const [currentConversation, setCurrentConversation] = useState(null);  // لتخزين المحادثة الحالية

    const handleSelectConversation = (id) => {
        setCurrentConversation(id);  // تحديث المحادثة الحالية عند اختيار جهة اتصال
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar onSelectConversation={handleSelectConversation} />
            <div className="flex-1 bg-white p-5">
                {currentConversation ? (
                    <div> {/* عرض المحادثة الحالية */} 
                        <h1>Conversation with ID: {currentConversation}</h1>
                    </div>
                ) : (
                    <h2>Select a contact to start chatting</h2> // رسالة عند عدم اختيار محادثة
                )}
            </div>
        </div>
    );
};

export default MessagingApp;


