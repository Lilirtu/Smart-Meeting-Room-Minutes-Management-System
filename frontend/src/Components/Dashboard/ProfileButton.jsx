import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function ProfileButton() {
  const navigate = useNavigate();

  return (
    <FaUserCircle
      className="icon"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate('/profile')}
    />
  );
}

export default ProfileButton;
