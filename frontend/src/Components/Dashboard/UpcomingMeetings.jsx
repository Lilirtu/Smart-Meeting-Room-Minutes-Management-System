import React from 'react';

const UpcomingMeetings = () => {
  return (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      width: '250px',
      color: 'black' // <-- Set text color to black
    }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Upcoming Meetings</h3>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        <li style={{ marginBottom: '0.5rem' }}>📅 Project Sync – July 2</li>
        <li style={{ marginBottom: '0.5rem' }}>📅 Client Call – July 5</li>
        <li>📅 Review Meeting – July 9</li>
      </ul>
    </div>
  );
};

export default UpcomingMeetings;
