import React from "react";
import rotbot from "../asset/robot.gif"; 

export const ChatWindow = ({
  selectedUser,
  currentUser,
  conversations,
  currentMessage,
  handleMessageChange,
  sendMessage,
  uploadFile,
  filePreview,
}) => {
  return (
    <div className="flex-1 bg-white flex flex-col relative">
      {!selectedUser ? (
        <div className="flex justify-center items-center flex-grow">
          <img src={rotbot} alt="Robot" className="w-1/2 opacity-50" />
        </div>
      ) : (
        <>
          <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
            <div className="flex items-center">
              <img
                src={selectedUser.image}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-3"
              />
              <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
            </div>
          </div>
          <MessageList conversations={conversations[selectedUser.name]} currentUser={currentUser} />
          <MessageInput
            currentMessage={currentMessage}
            handleMessageChange={handleMessageChange}
            sendMessage={sendMessage}
            uploadFile={uploadFile}
            filePreview={filePreview}
          />
        </>
      )}
    </div>
  );
};

const MessageList = ({ conversations, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="bg-opacity-75 p-4 rounded-lg">
        {conversations?.map((message, index) => (
          <div
            key={index}
            className={`flex items-start ${
              message.sender === currentUser.id ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender !== currentUser.id && (
              <img
                src="path/to/selectedUser.jpg" // Replace with the selected user's image
                alt="Profile"
                className="w-10 h-10 rounded-full mr-2"
              />
            )}
            <div className={`rounded-lg p-4 max-w-[70%] shadow-md ${message.sender === currentUser.id ? "bg-blue-500 text-white" : "bg-green-300"}`}>
              <p>{message.content}</p>
              {/* Additional message display logic can go here */}
            </div>
            {message.sender === currentUser.id && (
              <img
                src={currentUser.image}
                alt="Profile"
                className="w-10 h-10 rounded-full ml-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MessageInput = ({ currentMessage, handleMessageChange, sendMessage, uploadFile, filePreview }) => {
  return (
    <div className="bg-white py-4 px-6 flex items-center shadow-lg">
      {filePreview && (
        <img
          src={filePreview}
          alt="Preview"
          className="w-16 h-16 rounded-md mr-3"
        />
      )}
      <input
        type="text"
        value={currentMessage}
        onChange={handleMessageChange}
        className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
      {(currentMessage.trim() || filePreview) && (
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white py-2 px-4 rounded-full ml-2 hover:bg-blue-700 transition duration-200"
        >
          Send
        </button>
      )}
      <input
        id="file-upload"
        type="file"
        onChange={uploadFile}
        className="hidden"
      />
      <label htmlFor="file-upload" className="ml-2 cursor-pointer">
        {/* Upload icon here */}
      </label>
    </div>
  );
};