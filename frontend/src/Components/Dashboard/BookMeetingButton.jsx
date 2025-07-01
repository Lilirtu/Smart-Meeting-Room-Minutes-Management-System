// src/components/BookMeetingButton.jsx
import { useState } from 'react';

function BookMeetingButton({ onSelect }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (type) => {
    setOpen(false);
    if (onSelect) onSelect(type);
    alert(`You selected: ${type} meeting`);
  };

  return (
    <div style={{ 
      position: 'relative', 
      display: 'inline-block', 
      width: '100%', 
      maxWidth: '400px' // allows it to scale on larger screens
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Book a Meeting ⏷
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            borderRadius: '6px',
            zIndex: 999,
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Online Option */}
          <div
            onClick={() => handleSelect('Online')}
            style={{ 
              padding: '0.75rem', 
              cursor: 'pointer', 
              borderBottom: '1px solid #eee' 
            }}
          >
            <strong>📞 Online</strong>
            <div style={{ fontSize: '0.85rem', color: '#555' }}>
              Meet virtually via Zoom or Google Meet.
            </div>
          </div>

          {/* Onsite Option */}
          <div
            onClick={() => handleSelect('Onsite')}
            style={{ padding: '0.75rem', cursor: 'pointer' }}
          >
            <strong>🏢 Onsite</strong>
            <div style={{ fontSize: '0.85rem', color: '#555' }}>
              Attend in-person at our office.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookMeetingButton;
