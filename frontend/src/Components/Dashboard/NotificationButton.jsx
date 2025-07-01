// src/components/NotificationButton.jsx
import { FaBell } from 'react-icons/fa';

function NotificationButton({ count = 0 }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '0.5rem',
        cursor: 'pointer',
      }}
    >
      <FaBell size={24} color="#333" />

      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            transform: 'translate(50%, -50%)',
            background: 'red',
            color: 'white',
            borderRadius: '999px',
            padding: '2px 6px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            minWidth: '1.25rem',
            textAlign: 'center',
            lineHeight: '1rem',
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

export default NotificationButton;
