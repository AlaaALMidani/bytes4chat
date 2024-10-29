// import React, { useState } from 'react';
// import robot from './robot.gif'; 

// const ChatApp = () => {
//   const [selectedUser, setSelectedUser] = useState(null);

//   const handleUserSelect = (user) => {
//     setSelectedUser(user);
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="bg-gray-800 text-white w-1/4 p-5 flex flex-col">
//         <h2 className="text-lg font-semibold mb-5">Message</h2>
//         <p className="text-gray-400 flex-grow">Explore users to start a conversation with.</p>
//         <div className="space-y-3 overflow-y-auto">
//           <div
//             className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer space-x-3"
//             onClick={() => handleUserSelect({ name: 'John Doe', image: 'https://via.placeholder.com/150' })}
//           >
//             <img
//               src="https://via.placeholder.com/150"
//               alt="John Doe"
//               className="w-10 h-10 rounded-full"
//             />
//             <div className="flex-1">

//               <div className="text-sm font-medium">John Doe</div>

//               <div className="text-xs text-gray-300 truncate">Hey, how are you?</div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="text-xs text-gray-500 whitespace-nowrap">12:34 PM</div>
//               <span className="bg-green-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
//                 2
//               </span>
//             </div>
//           </div>
//           {/* Add more user options */}
//         </div>
//       </div>
//       <div className="flex-1 bg-white p-5 flex flex-col">
//         {selectedUser ? (
//           <div className="flex items-center space-x-3 mb-5">
//             <img
//               src={selectedUser.image}
//               alt={selectedUser.name}
//               className="w-10 h-10 rounded-full"
//             />
//             <div className="text-lg font-medium">{selectedUser.name}</div>
//           </div>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//                           <img src={robot} alt="Robot" className=" rounded-full mx-auto mb-5" />

//           </div>
//         )}
//         <div className="flex-grow"></div>
//         <div className="bg-gray-100 p-3 rounded-lg">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             className="w-full bg-transparent outline-none"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatApp;