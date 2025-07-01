import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInForm from './Components/LogInForm/LogInForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import RoomBookingForm from './Components/RoomBookingForm/MeetingRoomBooking';
import Dashboard from './Components/Dashboard/Dashboard';
import React from 'react';
import axios from 'axios';
// import other pages/components as needed

axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogInForm />} />           {/* 👈 Add this to handle root */}
        <Route path="/login" element={<LogInForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/booking" element={<RoomBookingForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
