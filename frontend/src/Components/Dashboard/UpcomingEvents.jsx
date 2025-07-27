import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/user-meetings', { withCredentials: true })
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching upcoming meetings:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card">
      <h4>Upcoming Events</h4>
      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No upcoming events</p>
      ) : (
        <ul className="list-group">
          {events.map((event) => (
            <li key={event.id} className="list-group-item">
              {event.title} — {event.date} @ {event.start}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UpcomingEvents;
