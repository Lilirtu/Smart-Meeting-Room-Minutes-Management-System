import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Pages / components (adjust paths as necessary)
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

/** Guards */
function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function RequireAdmin({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const roleId =
    localStorage.getItem('RoleId') !== null
      ? Number(localStorage.getItem('RoleId'))
      : localStorage.getItem('roleId') !== null
      ? Number(localStorage.getItem('roleId'))
      : null;

  const isAdmin = !!token && roleId === 1; // 1 = Admin
  if (!isAdmin) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

/** Router */
export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Authenticated core */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      {/* Rooms list + aliases (for your existing buttons/links) */}
      <Route
        path="/rooms"
        element={
          <RequireAuth>
            <RoomsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/room-list"
        element={
          <RequireAuth>
            <RoomsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/room-management"
        element={
          <RequireAuth>
            <RoomsPage />
          </RequireAuth>
        }
      />

      {/* Room details (expects /rooms/:id) */}
      <Route
        path="/rooms/:id"
        element={
          <RequireAuth>
            <RoomDetails />
          </RequireAuth>
        }
      />

      {/* Booking: keep your original and an alias used by the details page */}
      <Route
        path="/book-room"
        element={
          <RequireAuth>
            <MeetingRoomBooking />
          </RequireAuth>
        }
      />
      <Route
        path="/booking/:id"
        element={
          <RequireAuth>
            <MeetingRoomBooking />
          </RequireAuth>
        }
      />

      {/* Minutes & reviews */}
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

      {/* Notifications */}
      <Route
        path="/notifications"
        element={
          <RequireAuth>
            <Notifications />
          </RequireAuth>
        }
      />

      {/* Submit assignment (hyphen + no-hyphen) */}
      <Route
        path="/submit-assignment"
        element={
          <RequireAuth>
            <SubmitAssignment />
          </RequireAuth>
        }
      />
      <Route
        path="/submitassignment"
        element={
          <RequireAuth>
            <SubmitAssignment />
          </RequireAuth>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
