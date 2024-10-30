import React, { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import io from "socket.io-client";
import Fetch from "../fetchLogic";

const MessagingApp = () => {
  const [conversations, setConversations] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [currentUser] = useState({ name: "Anwar", image: "path/to/anwar.jpg", id: 1 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("https://ee8f-5-155-171-224.ngrok-free.app");

    socket.current.on("receiveMessage", (message) => {
      setConversations((prev) => ({
        ...prev,
        [message.to]: [...(prev[message.to] || []), message],
      }));
    });

    Fetch.getUserContacts("token").then((data) => {
      setUsers(data.contacts);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  const sendMessage = () => {
    const trimmedMessage = currentMessage.trim();
    if (trimmedMessage === "" && !uploadedFile) return;

    const message = {
      content: trimmedMessage,
      sender: currentUser.id,
      to: selectedUser.name,
      timestamp: new Date().toISOString(),
      file: uploadedFile || null,
    };

    socket.current.emit("sendMessage", message);
    setConversations((prev) => ({
      ...prev,
      [selectedUser.name]: [
        ...(prev[selectedUser.name] || []),
        { ...message, status: "sent" },
      ],
    }));
    
    setCurrentMessage("");
    setUploadedFile(null);
    setFilePreview(null);
  };

  const uploadFile = (event) => {
    const selectedFile = event.target.files[0];
    setUploadedFile(selectedFile);
    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      <ChatWindow
        selectedUser={selectedUser}
        currentUser={currentUser}
        conversations={conversations}
        currentMessage={currentMessage}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        uploadFile={uploadFile}
        filePreview={filePreview}
      />
    </div>
  );
};

export default MessagingApp;