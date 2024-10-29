import React, { useState } from 'react';
import { FaMicrophone, FaUpload, FaPaperPlane } from 'react-icons/fa';

const MessageInput = ({ currentUser, selectedUser, setConversations }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const sendMessage = () => {
    if (currentMessage.trim() === '' && !audioBlob && !uploadedFile) return;

    const newMessage = {
      content: currentMessage,
      status: 'pending',
      file: audioBlob || uploadedFile,
      sender: currentUser,
      timestamp: new Date().toISOString(),
    };

    setConversations(prev => ({
      ...prev,
      [selectedUser.name]: [...(prev[selectedUser.name] || []), newMessage],
    }));

    setCurrentMessage('');
    setAudioBlob(null);
    setUploadedFile(null);
    setFilePreview(null);
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

  return (
    <div className="bg-white py-4 px-6 flex items-center shadow-lg">
      {filePreview && (
        <img src={filePreview} alt="Preview" className="w-16 h-16 rounded-md mr-3" />
      )}
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />
      <button onClick={sendMessage} className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200">
        <FaPaperPlane />
      </button>
      <input id="file-upload" type="file" onChange={uploadFile} className="hidden" />
      <label htmlFor="file-upload" className="ml-2 cursor-pointer">
        <FaUpload className="text-gray-500 hover:text-blue-600 transition duration-200" />
      </label>
      {isRecording ? (
        <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-4 rounded-full ml-2 hover:bg-red-600 transition duration-200">
          Stop
        </button>
      ) : (
        <button onClick={startRecording} className="bg-white text-blue-600 py-2 px-4 rounded-full ml-2 border border-blue-600 hover:bg-blue-100 transition duration-200">
          <FaMicrophone />
        </button>
      )}
    </div>
  );
};

export default MessageInput;