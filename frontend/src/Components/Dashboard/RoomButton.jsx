import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoomButton() {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-primary full-width"
      onClick={() => navigate('/room-list')} // Navigates to room list page
    >
      Room Management
    </button>
  );
}

export default RoomButton;
