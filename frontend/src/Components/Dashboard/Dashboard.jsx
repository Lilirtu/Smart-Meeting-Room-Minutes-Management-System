import React from 'react';
import CreateMeeting from './CreateMeeting';
import CalendarWidget from './CalendarWidget';
import UpcomingEvents from './UpcomingEvents';
import DeadlineAlert from './DeadlineAlert';
import NotificationButton from './NotificationButton';
import ProfileButton from './ProfileButton';
import '../Assets/style.css';
import { FaDoorOpen, FaPaperPlane } from 'react-icons/fa';  // Import icons

function Dashboard() {
  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <h2>Dashboard</h2>
        <div className="icon-group">
          <NotificationButton />
          <ProfileButton />
        </div>
      </nav>

      <div className="dashboard-grid">
        <div className="left-column">
          <CreateMeeting />

          {/* New Manage Rooms Button */}
          <button className="custom-button">
            <FaDoorOpen style={{ marginRight: '8px' }} />
            Manage Rooms
          </button>

          {/* New Submit Work Button */}
          <button className="custom-button">
            <FaPaperPlane style={{ marginRight: '8px' }} />
            Submit Work
          </button>

          <DeadlineAlert />
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
}

export default Dashboard;
