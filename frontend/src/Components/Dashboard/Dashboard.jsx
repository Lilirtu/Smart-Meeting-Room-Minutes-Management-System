import NotificationButton from './NotificationButton';
import ProfileButton from './ProfileButton';
import BookMeetingButton from './BookMeetingButton';
import CalendarWidget from './CalendarWidget';
import DeadlineAlert from './DeadlineAlert';
import UpcomingMeetings from './UpcomingMeetings';
import RoomManagementButton from './RoomManagementButton';
import SubmitWorkButton from './SubmitWorkButton';

function Dashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      boxSizing: 'border-box',
    }}>
      
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <NotificationButton count={3} />
        <ProfileButton />
      </div>

      {/* Main layout */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        alignItems: 'flex-start',
        width: '100%',
      }}>
        <div style={{
          flex: '1 1 250px',
          minWidth: '250px',
          maxWidth: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <BookMeetingButton />
          <RoomManagementButton /> {/* Added here */}
          <UpcomingMeetings />
        </div>

        <div style={{ flex: '2 1 350px', minWidth: '300px', maxWidth: '600px' }}>
          <CalendarWidget />
        </div>

        <div style={{ flex: '1 1 300px', minWidth: '250px', maxWidth: '350px' }}>
          <DeadlineAlert />
          <SubmitWorkButton /> {/* Added here */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
