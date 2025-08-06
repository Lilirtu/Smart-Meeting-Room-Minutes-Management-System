import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UpcomingEvents() {
  const [deadlines, setDeadlines] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('User not authenticated');
          return;
        }

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
        console.log("Formatted date:", formattedDate); // Log the formatted date

        const response = await axios.get(`http://localhost:8000/api/upcoming-events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { date: formattedDate }, // Pass the formatted date
        });

        // Check if there is data and update state
        if (response.data && response.data.length > 0) {
          setDeadlines(response.data);
        } else {
          setError('No upcoming deadlines found');
        }
      } catch (err) {
        if (err.response) {
          console.error('Server error:', err.response.status, err.response.data); // Log the server error details
          setError(`Server error: ${err.response.status} - ${err.response.data.message || 'An error occurred'}`);
        } else {
          console.error('Network error:', err.message); // Log any network-related issues
          setError('Failed to load upcoming events');
        }
      }
    };

    fetchDeadlines();
  }, []); // Empty dependency array, this effect runs once when the component mounts

  return (
    <div className="card">
      <h4>Due Date</h4>
      <ul className="list-group">
        {error && <li className="list-group-item text-danger">{error}</li>}
        {deadlines.length > 0 ? (
          deadlines.map((item, index) => (
            <li key={index} className="list-group-item">
              {index + 1}. {item.Description} (Due: {item.DueDate})
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">No deadlines available</li>
        )}
      </ul>
    </div>
  );
}

export default UpcomingEvents;
