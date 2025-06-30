import React, { useState } from "react";
import "./MeetingRoomBooking.css";

const MeetingRoomBooking = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    attendees: "",
    room: "",
    recurring: false,
    video: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Meeting booked:", formData);
  };

  return (
    <div className="booking-container">
      <h2>Book a Meeting Room</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <input
          type="text"
          name="title"
          placeholder="Meeting Title"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="attendees"
          placeholder="Attendees (comma-separated emails)"
          onChange={handleChange}
        />

        <select name="room" onChange={handleChange} required>
          <option value="">Select Room</option>
          <option value="Room A">Room A</option>
          <option value="Room B">Room B</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="recurring"
            onChange={handleChange}
          />
          Recurring Meeting
        </label>

        <label>
          <input
            type="checkbox"
            name="video"
            onChange={handleChange}
          />
          Video Conferencing
        </label>

        <div className="button-group">
          <button type="submit">Book Now</button>
          <button type="reset">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default MeetingRoomBooking;
