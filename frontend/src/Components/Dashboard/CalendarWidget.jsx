import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

function CalendarWidget() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const formattedDate = formatDate(selectedDate);

  // 🟢 Ensure axios sends cookies with requests
  axios.defaults.withCredentials = true;

  useEffect(() => {
  const fetchEvents = async () => {
    if (!formattedDate) return;

    setLoading(true);

    try {
      // Step 1: Get CSRF cookie
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      // Step 2: Make authenticated call (Sanctum uses cookies, no token needed)
      const res = await axios.get("http://127.0.0.1:8000/api/user-meetings", {
        params: { date: formattedDate },
        withCredentials: true,
      });

      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([{ title: "Failed to load events" }]);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, [formattedDate]);

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
        minWidth: '250px',
        padding: '15px',
        borderRadius: '8px',
        background: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h5>Events on {formattedDate}</h5>
        {loading ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p>No events on this day.</p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                {event.title} ({event.start} - {event.end}) in {event.room}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CalendarWidget;
