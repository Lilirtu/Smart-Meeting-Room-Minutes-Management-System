import React from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function NotificationButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Notifications');
  };

  return (
    <button onClick={handleClick} className="notification-icon-button" title="Notifications">
      <FaBell size={20} />
    </button>
  );
}

export default NotificationButton;
