import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('/conversations')
            .then(response => {
                setConversations(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching conversations:", error);
                setLoading(false);
            });
    }, []);

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="bg-gray-800 text-white w-7 h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-800 text-white w-full h-screen p-5">
            <h2 className="text-lg font-semibold mb-5">Conversations</h2>

            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white placeholder-gray-400"
            />

            <div className="space-y-3 overflow-y-auto h-full">
                {filteredConversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => onSelectConversation(conv)} 
                        className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer space-x-3"
                    >
                        <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full" />

                        <div className="flex-1">
                            <div className="text-sm font-medium">{conv.name}</div>
                            <div className="text-xs text-gray-300 truncate">{conv.lastMessage}</div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                {conv.time}
                            </div>

                            {conv.unreadCount > 0 && (
                                <span className="bg-green-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;