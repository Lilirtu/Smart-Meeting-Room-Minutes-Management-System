import React from 'react';

function CreateMeeting() {
  return (
    <div className="card">
      <h4>Create Meeting</h4>
      <select className="select-box">
        <option value="">Select meeting type</option>
        <option value="remote">Remote Meeting</option>
        <option value="onsite">Onsite Meeting</option>
      </select>
    </div>
  );
}

export default CreateMeeting;
