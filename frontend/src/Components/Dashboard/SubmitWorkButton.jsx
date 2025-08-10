import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa'; // match the icon style

function SubmitWorkButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="custom-button"                // same class as Manage Rooms
      onClick={() => navigate('/submitassignment')}
    >
      <FaPaperPlane style={{ marginRight: '8px' }} />
      Submit Work
    </button>
  );
}

export default SubmitWorkButton;
