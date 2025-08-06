import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

function CalendarWidget({ userId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch events from the backend based on selected date
  const fetchEvents = async (date) => {
    setLoading(true);
    setError(''); // Clear any previous errors
    setEvents([]); // Clear previous event data
    const formattedDate = formatDate(date);

    try {
      // Ensure the userId and token exist before making the request
      if (!userId || !localStorage.getItem('token')) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/DashboardConnection/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT token stored in localStorage
        },
        params: {
          date: formattedDate,
        },
      });

      // Check if the response contains data
      if (response.data.meeting_title) {
        // Assuming response contains event data
        setEvents([
          `Meeting: ${response.data.meeting_title}`,
          `Room: ${response.data.room_name}`,
          `Location: ${response.data.room_location}`,
        ]);
      } else {
        setError('No meetings'); // Set error if no data is found
      }
    } catch (err) {
      setError('No meetings found');
      console.error(err);  // Log the error for debugging
    }
    setLoading(false);
  };

  // Format date in 'YYYY-MM-DD' format for API request
  const formatDate = (date) => {
    if (!date) return '';
    // Convert to UTC (to avoid time zone issues) and format as 'YYYY-MM-DD'
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // Adjust to UTC
    return d.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
  };

  // UseEffect to fetch events whenever the selected date changes
  useEffect(() => {
    fetchEvents(selectedDate); // Fetch events when component loads or date changes
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
        minWidth: '220px',
        padding: '15px',
        borderRadius: '8px',
        background: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}>
        <h5>Meetings on {formattedDate || 'No date selected'}</h5>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'black' }}>{error}</p>} {/* Error displayed in black */}

        <ul>
          {events.length > 0 ? (
            events.map((event, index) => (
              <li key={index}>{event}</li>
            ))
          ) : (
            <li>No meetings on this day</li>  
          )}
        </ul>
      </div>
    </div>
  );
}

export default CalendarWidget;
