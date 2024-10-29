import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Sidebar = ({ users, searchTerm, setSearchTerm, selectedUser, handleUserClick }) => {
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer space-x-3">
            <div className="flex items-center mb-4">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>
            <h2 className="text-xl mb-4 font-semibold text-gray-700">Users</h2>
            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <div className="text-gray-500">No users found</div>
                ) : (
                    filteredUsers.map((user, index) => (
                        <div
                            key={index}
                            className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded transition duration-200 ${
                                selectedUser?.name === user.name ? 'bg-gray-300' : ''
                            }`}
                            onClick={() => handleUserClick(user)}
                        >
                            <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                            <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;