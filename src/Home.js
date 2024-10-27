import React, { useState } from 'react';

const MessagingApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen">
      <div className="bg-gray-100 w-1/4 p-4">
        <h2 className="text-lg font-bold mb-4">Explore users</h2>
        <ul>
          <li
            className="hover:bg-gray-200 cursor-pointer p-2 rounded"
            onClick={() => handleUserSelect({ name: 'John Doe', image: 'user1.jpg' })}
          >
            <div className="flex items-center">
              <img
                src="user1.jpg"
                alt="User 1"
                className="w-10 h-10 rounded-full mr-2"
              />
              <span>John Doe</span>
            </div>
          </li>
          <li
            className="hover:bg-gray-200 cursor-pointer p-2 rounded"
            onClick={() => handleUserSelect({ name: 'Jane Smith', image: 'user2.jpg' })}
          >
            <div className="flex items-center">
              <img
                src="user2.jpg"
                alt="User 2"
                className="w-10 h-10 rounded-full mr-2"
              />
              <span>Jane Smith</span>
            </div>
          </li>
          {/* Add more users as needed */}
        </ul>
      </div>
      <div className="flex-1 bg-white p-4">
        {selectedUser ? (
          <div>
            <div className="flex items-center mb-4">
              <img
                src={selectedUser.image}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <h2 className="text-lg font-bold">{selectedUser.name}</h2>
            </div>
            <div className="flex flex-col">
              {/* Add message history and input here */}
            </div>
          </div>
        ) : (
          <p>Select a user to start a conversation.</p>
        )}
      </div>
    </div>
  );
};

export default MessagingApp;