import React, { useState, useEffect } from 'react';
import fetchContacts from '../uinty/Fetch'; 

const Sidebar = ({ onSelectConversation }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
    fetch('https://d620-5-0-145-81.ngrok-free.app/contacts') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  
        })
        .then(data => {
            if (data.contacts) {
                setContacts(data.contacts);
            } else {
                console.error("Contacts data not found in response:", data);
            }
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching contacts:", error);
            setLoading(false);
        });
}, []);

    const filteredContacts = contacts.filter(contact =>
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-gray-800 text-white w-full h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center w-full h-screen bg-gray-800">
            <div className="bg-gray-900 text-white md:w-1/3 w-full p-5 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-5 text-center">Contacts</h2>

                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <ul className="space-y-3">
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                            <li
                                key={contact.id}
                                onClick={() => onSelectConversation(contact.id)}
                                className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-600 cursor-pointer space-x-3 transition duration-200"
                            >
                                <img src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} className="w-12 h-12 rounded-full" />
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{`${contact.firstName} ${contact.lastName}`}</div>
                                    <div className="text-xs text-gray-300 truncate">{contact.phoneNumber}</div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="text-gray-400 text-center">No contacts found.</div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;