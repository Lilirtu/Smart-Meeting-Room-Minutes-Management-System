// router.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home from './Components/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginForm from './Components/LogInForm/LogInForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import MeetingRoomBooking from './Components/RoomBookingForm/MeetingRoomBooking';
import MinutesForm from './Components/MinutesForm/MinutesForm';
import PostMeetingReview from './Components/PostMeetingReview/PostMeetingReview';
import Notifications from './Components/Notifications/Notifications';
import RoomsPage from './Components/RoomsPage/RoomsPage';
import RoomDetails from './Components/RoomDetails/RoomDetails';
import SubmitAssignment from './Components/SubmitAssignment';
import Profile from './Components/Profile/Profile';
import RoomList from './Components/AdminPanel/RoomList';
import RoomForm from './Components/AdminPanel/RoomForm';

// ------- Route guards -------
function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Read RoleId from the stored "user" object
  let roleId = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      roleId =
        u?.RoleId ??
        u?.roleId ??
        (typeof u?.role === 'number' ? u.role : null) ??
        (localStorage.getItem('RoleId') ? Number(localStorage.getItem('RoleId')) : null);
    }
  } catch {
    // ignore parse errors; roleId stays null
  }

  const isAdmin = !!token && Number(roleId) === 1; // 1 = Admin

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

// ------- Router component -------
export default function RouterComponent() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Auth-only */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/booking"
        element={
          <RequireAuth>
            <MeetingRoomBooking />
          </RequireAuth>
        }
      />
      <Route
        path="/booking/:roomId"
        element={
          <RequireAuth>
            <MeetingRoomBooking />
          </RequireAuth>
        }
      />
      <Route
        path="/minutes"
        element={
          <RequireAuth>
            <MinutesForm />
          </RequireAuth>
        }
      />
      <Route
        path="/post-meeting-review"
        element={
          <RequireAuth>
            <PostMeetingReview />
          </RequireAuth>
        }
      />
      <Route
        path="/notifications"
        element={
          <RequireAuth>
            <Notifications />
          </RequireAuth>
        }
      />

      {/* Rooms (left public as you had) */}
      <Route path="/rooms" element={<RoomsPage />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />

      {/* Misc */}
      <Route path="/submit-assignment" element={<SubmitAssignment />} />

    

      {/* Admin tab routes */}
      <Route
        path="/room-list"
        element={
          <RequireAdmin>
            <RoomList />
          </RequireAdmin>
        }
      />
      <Route
        path="/add-room"
        element={
          <RequireAdmin>
            <RoomForm />
          </RequireAdmin>
        }
      />
      <Route
        path="/profile"
        element={
         <RequireAuth>
           <Profile />
        </RequireAuth>
        }
      />


      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
