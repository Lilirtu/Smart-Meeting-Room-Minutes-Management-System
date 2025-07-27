import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../Assets/style.css';

function DeadlineAlert() {
  const [showAlert, setShowAlert] = useState(false);

  // Example: Your project deadline (replace this with real data later)
  const deadlineDate = new Date('2025-07-10');  // Replace with real date

  useEffect(() => {
    const today = new Date();
    const timeDiff = deadlineDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft >= 0 && daysLeft <= 3) {
      setShowAlert(true);
    }
  }, []);

  if (!showAlert) return null;

  return (
    <div className="deadline-alert">
      <FaExclamationTriangle className="deadline-alert-icon" />
      <span style={{ flex: 1 }}>
        Your project deadline is in <strong>{Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))} day(s)</strong>. Please submit your work soon.
      </span>
      <button className="close-button" onClick={() => setShowAlert(false)}>×</button>
    </div>
  );
}

export default DeadlineAlert;
