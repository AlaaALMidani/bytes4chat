import React, { useState, useEffect, useRef } from 'react';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import  Robot  from '../asset/robot.gif';
import anwar from '../asset/phot.jpeg';
import ali from '../asset/download (4).jpeg';
import alaa from '../asset/download (5).jpeg';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const MessagingApp = () => {
  const [conversations, setConversations] = useState({});
  const [currentUser] = useState({ name: 'Anwar', image: anwar });
  const [selectedUser, setSelectedUser] = useState(null);
  const chatContainerRef = useRef(null);
  
  const users = [
    { name: 'Anwar', image: anwar },
    { name: 'Ali', image: ali },
    { name: 'Alaa', image: alaa },
  ];
  const MessagingApp = () => {
    const { user } = useAuth();
  
    if (!user) {
      return <Navigate to="/login" />;
    }
  }
  useEffect(() => {
    const webSocket = new WebSocket('https://d620-5-0-145-81.ngrok-free.app/contacts');

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

    return () => {
      webSocket.close();
    };
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <UserList users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      <div className="flex-1 bg-white flex flex-col relative">
        {!selectedUser ? (
          <div className="flex justify-center items-center flex-grow">
<img src={Robot}>
</img>          
</div>
        ) : (
          <>
            <ChatWindow conversations={conversations} selectedUser={selectedUser} />
            <MessageInput currentUser={currentUser} selectedUser={selectedUser} setConversations={setConversations} />
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingApp;