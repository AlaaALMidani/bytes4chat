import React, { useState, useEffect } from 'react';
import rotbot from '../asset/robot.gif';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); 

const MessagingApp = () => {
    const [conversations, setConversations] = useState({}); 
    const [selectedUser] = useState({ name: 'Anwar', image: './phot.jpeg' }); 
    const [messageInput, setMessageInput] = useState(''); 

    useEffect(() => {
        socket.on('private message', ({ from, message }) => {
            setConversations((prev) => ({
                ...prev,
                [from]: [...(prev[from] || []), { sender: { name: from, image: './phot.jpeg' }, content: message, timestamp: new Date().toISOString() }],
            }));
        });

        return () => {
            socket.off('private message'); 
        };
    }, []);

    const sendMessage = (content) => {
        if (!selectedUser || !content.trim()) return; 

        const newMessage = {
            content,
            sender: selectedUser, 
            timestamp: new Date().toISOString(),
        };

        
        setConversations((prev) => ({
            ...prev,
            [selectedUser.name]: [...(prev[selectedUser.name] || []), newMessage],
        }));

        
        socket.emit('private message', { recipient: selectedUser.name, message: content });

        
        setMessageInput('');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 bg-white flex flex-col relative">
                {/* Chat Interface */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversations[selectedUser.name]?.length === 0 ? (
                        <div className="flex justify-center items-center flex-grow">
                            <img src={rotbot} alt="Robot" className="w-1/2 opacity-50" />
                        </div>
                    ) : (
                        <div className="bg-opacity-75 p-4 rounded-lg">
                            {conversations[selectedUser.name].map((conversation, index) => (
                                <div key={index} className={`flex items-start ${conversation.sender.name === selectedUser.name ? 'justify-end' : 'justify-start'}`}>
                                    {conversation.sender.name !== selectedUser.name && (
                                        <img src={conversation.sender.image} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
                                    )}
                                    <div className={`rounded-lg p-4 max-w-[70%] text-wrap shadow-md transition-all duration-300 ease-in-out ${conversation.sender.name === selectedUser.name ? 'bg-blue-500 text-white' : 'bg-green-300'}`}>
                                        <p>{conversation.content}</p>
                                        <div className="flex items-center mt-2">
                                            <span className="text-gray-600 text-sm">
                                                {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    {conversation.sender.name === selectedUser.name && (
                                        <img src={selectedUser.image} alt="Profile" className="w-10 h-10 rounded-full ml-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="border rounded-full p-2 w-full"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage(messageInput);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MessagingApp;