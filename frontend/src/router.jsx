import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginForm from './Components/LogInForm/LogInForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import MeetingRoomBooking from './Components/RoomBookingForm/MeetingRoomBooking';
import MinutesForm from './Components/MinutesForm/MinutesForm';
import PostMeetingReview from './Components/PostMeetingReview/PostMeetingReview';

const RouterComponent = () => {
  // Check if user is authenticated (token is available in localStorage)
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      
      {/* Protected Route: Redirect to login if not authenticated */}
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      
      <Route path="/booking" element={isAuthenticated ? <MeetingRoomBooking /> : <Navigate to="/login" />} />
      <Route path="/minutes_of_meeting" element={isAuthenticated ? <MinutesForm /> : <Navigate to="/login" />} />
      <Route path="/post-meeting-review" element={isAuthenticated ? <PostMeetingReview /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default RouterComponent;
