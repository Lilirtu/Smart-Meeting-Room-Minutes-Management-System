import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Custom Components
import CreateMeeting from './CreateMeeting';
import CalendarWidget from './CalendarWidget';
import UpcomingEvents from './UpcomingEvents';
import DeadlineAlert from './DeadlineAlert';
import NotificationButton from './NotificationButton';
import ProfileButton from './ProfileButton';
import PostMeetingReviewButton from './PostMeetingReviewButton';  // Imported the new button

// Icons
import { FaDoorOpen, FaPaperPlane, FaSignOutAlt } from 'react-icons/fa';

// Styles
import '../Assets/style.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // If no token or user, redirect to login
    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Optional: fetch fresh dashboard data from server
      axios.get("http://localhost:8000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Dashboard data:", response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Invalid or expired token:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      });
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.warn("Logout failed or token expired.");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <p className="text-center text-secondary fs-5">Loading...</p>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <h2>Dashboard</h2>
        <div className="icon-group">
          <NotificationButton />
          <ProfileButton />
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '6px' }} />
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-grid">
        <div className="left-column">
          <CreateMeeting />
          <button className="custom-button">
            <FaDoorOpen style={{ marginRight: '8px' }} />
            Manage Rooms
          </button>
          <button className="custom-button">
            <FaPaperPlane style={{ marginRight: '8px' }} />
            Submit Work
          </button>
          <DeadlineAlert />

          {/* Added PostMeetingReviewButton */}
          <PostMeetingReviewButton />
        </div>

        <div className="center-column">
          <CalendarWidget />
        </div>

        <div className="right-column">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
