import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

function CalendarWidget({ userId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format date in 'YYYY-MM-DD' format for API request
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // Adjust to UTC
    return d.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
  };

  // Fetch meetings for the selected date
  const fetchEvents = async (date) => {
    setLoading(true);
    setError('');
    setEvents([]);
    const formattedDate = formatDate(date);

    try {
      if (!userId || !localStorage.getItem('token')) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/DashboardConnection/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        params: { date: formattedDate },
      });

      if (response.data.meetings && response.data.meetings.length > 0) {
        setEvents(response.data.meetings);
      } else {
        setError('No meetings on this date');
      }
    } catch (err) {
      setError('No meetings found');
      console.error(err);
    }

    setLoading(false);
  };

  // Fetch meetings when selectedDate changes
  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  const formattedDate = formatDate(selectedDate);

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div>
        <h4>Calendar</h4>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </div>

      <div style={{
        minWidth: '280px',
        padding: '15px',
        borderRadius: '8px',
        background: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}>
        <h5>Meetings on {formattedDate || 'No date selected'}</h5>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'black' }}>{error}</p>}

        <ul>
          {events.length > 0 ? (
            events.map((event, index) => (
              <li key={index} style={{ marginBottom: '15px' }}>
                <strong>Meeting:</strong> {event.meeting_title} <br />
                <strong>Room:</strong> {event.room_name} <br />
                <strong>Location:</strong> {event.room_location}
              </li>
            ))
          ) : (
            !loading && <li>No meetings on this day</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CalendarWidget;
