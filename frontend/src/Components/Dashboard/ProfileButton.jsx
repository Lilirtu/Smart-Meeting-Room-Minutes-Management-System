import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

function ProfileButton() {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '0.5rem',
        cursor: 'pointer',
      }}
    >
      <FaUserCircle size={24} color="#333" />
    </div>
  );
}

export default ProfileButton;
