import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMicrophone, FaUpload } from 'react-icons/fa';
import backgroundImage from './wallapaper.jpeg';

const MessagingApp = () => {
  const [conversations, setConversations] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [currentUser] = useState({
    name: 'Anwar',
    image: 'profile1.jpg',
  });
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('/conversations');
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, []);

  const handleMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (currentMessage.trim() === '' && !audioBlob && !uploadedFile) return;

    const newMessage = {
      content: currentMessage,
      status: 'pending',
      file: audioBlob || uploadedFile,
      sender: currentUser,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) => [...prev, newMessage]);

    try {
      const formData = new FormData();
      formData.append('message', JSON.stringify(newMessage));
      if (audioBlob) {
        formData.append('file', audioBlob, 'recording.wav');
      } else if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const response = await axios.post('/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setConversations((prev) =>
        prev.map((msg) =>
          msg.timestamp === newMessage.timestamp
            ? { ...msg, status: 'sent', id: response.data.id, content: '', file: null } // Clear content and file
            : msg
        )
      );

      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }

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
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="bg-blue-500 text-white py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={currentUser.image} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
          <h1 className="text-lg font-bold">{currentUser.name}</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* <img src={backgroundImage}></img> */}
        {conversations.map((conversation, index) => (
          <div
            key={index}
            className={`flex items-start mb-4 ${conversation.sender.name === currentUser.name ? 'justify-end' : ''}`}
          >
            {conversation.sender.name !== currentUser.name && (
              <img
                src={conversation.sender.image}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-2"
              />
            )}
            <div
              className={`bg-green-300 rounded-lg p-3 max-w-[50%] text-wrap ${conversation.sender.name === currentUser.name ? 'bg-blue-500 text-white' : ''}`}
            >
              <p className="break-words">{conversation.content}</p>
              {conversation.file && (
                conversation.file.type.startsWith('audio/') ? (
                  <audio controls>
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
                {conversation.status === 'sent' && (
                  <div className="w-5 h-5 rounded-full bg-green-500 mr-2"></div>
                )}
                {conversation.status === 'delivered' && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 mr-2"></div>
                )}
                <span className="text-gray-500 text-sm">
                  {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            {conversation.sender.name === currentUser.name && (
              <img
                src={conversation.sender.image}
                alt="Profile"
                className="w-10 h-10 rounded-full ml-2"
              />
            )}
          </div>
        ))}
      </div>
      <div className="bg-gray-200 py-2 px-4 flex items-center">
        {filePreview && (
          <img
            src={filePreview}
            alt="Preview"
            className="w-16 h-16 rounded-md mr-2"
          />
        )}
        <input
          type="text"
          value={currentMessage}
          onChange={handleMessageChange}
          className="flex-1 py-2 px-3 rounded-full mr-2"
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        {currentMessage.trim() || audioBlob || uploadedFile ? (
          <button onClick={sendMessage} className="bg-blue-500 text-white py-2 px-4 rounded-full mr-2">
            Send
          </button>
        ) : null}
        <input id="file-upload" type="file" onChange={uploadFile} className="hidden" />
        <label htmlFor="file-upload" className="mr-2 cursor-pointer">
          <FaUpload className="text-gray-500" />
        </label>
        {isRecording ? (
          <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-4 rounded-full">
            Stop
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-white text-blue-500 py-2 px-4 rounded-full"
          >
            <FaMicrophone />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessagingApp;