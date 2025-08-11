import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card mb-3 shadow-sm p-3"
      onClick={() => navigate(`/rooms/${room.id}`)}
      style={{ cursor: "pointer" }}
    >
      <h5>{room.Name}</h5>
      <p><strong>Location:</strong> {room.Location}</p>
      <p><strong>Capacity:</strong> {room.Capacity} people</p>
    </div>
  );
};

export default RoomCard;
