// src/components/CalendarWidget.jsx
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarWidget() {
  const [date, setDate] = useState(new Date());

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      flex: '1 1 300px',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{
        marginBottom: '0.75rem',
        color: '#1a202c',
        fontSize: '1rem',
        fontWeight: '600',
      }}>
        Calendar
      </h3>

      <Calendar 
        onChange={setDate} 
        value={date} 
        style={{ width: '100%' }} 
      />

      <p style={{
        marginTop: '0.75rem',
        fontSize: '0.95rem',
        color: '#4a5568',
      }}>
        Selected Date: <strong>{date.toDateString()}</strong>
      </p>
    </div>
  );
}

export default CalendarWidget;
