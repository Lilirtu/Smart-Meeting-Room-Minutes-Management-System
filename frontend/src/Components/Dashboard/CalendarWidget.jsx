import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarWidget() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = {
    '2025-07-05': ['Team sync at 10AM', 'Client call at 2PM'],
    '2025-07-06': ['Review presentation'],
    '2025-07-10': ['Project Deadline'],
    '2025-07-15': ['Quarter Review'],
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const formattedDate = formatDate(selectedDate);
  const dayEvents = events[formattedDate] || ['No events on this day'];

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
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h5>Events on {formattedDate || 'No date selected'}</h5>
        <ul>
          {dayEvents.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarWidget;
