// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MessagingApp from './components/MessagingApp';
import Register from './components/Register';
import Login from './components/Login';
// import Message from "./MessageHandel"
import Message from './MessageHandel'
// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/register" />;
// };

const App = () => {
  return (
    <Message/>
    // <AuthProvider>
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<Navigate to="/register" />} /> {/* Redirect to Register */}
    //       <Route path="/register" element={<Register />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/messaging" element={<ProtectedRoute><MessagingApp /></ProtectedRoute>} />
    //     </Routes>
    //   </Router>
    // </AuthProvider>
  );
};

export default App;