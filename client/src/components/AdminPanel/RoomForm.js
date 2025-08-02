import React, { useState } from "react";

const RoomForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    status: "Available",
    equipment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: formData.name,
        Location: formData.location,
        Capacity: parseInt(formData.capacity),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add room");
        return res.json();
      })
      .then(() => {
        alert("Room added successfully!");
        setFormData({
          name: "",
          location: "",
          capacity: "",
          status: "Available",
          equipment: "",
        });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="room-form">
      <h3>Add New Room</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Room Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
        />
        <textarea
          name="equipment"
          placeholder="Equipment (e.g., mic, projector)"
          value={formData.equipment}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Add Room</button>
      </form>
    </div>
  );
};

export default RoomForm;
