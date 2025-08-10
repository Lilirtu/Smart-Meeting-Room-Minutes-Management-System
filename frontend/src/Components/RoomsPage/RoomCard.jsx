import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Resolve the ID from different possible field names
  const resolvedId = room?.id ?? room?.Id ?? room?.roomId ?? room?.RoomId;

  const handleClick = () => {
    if (!resolvedId) {
      console.error("Room ID is missing; cannot navigate.");
      return;
    }
    navigate(`/rooms/${resolvedId}`);  // Navigate to RoomDetails page
  };

  return (
    <div
      className="card mb-3 shadow-sm p-3"
      onClick={handleClick}
      style={{ cursor: resolvedId ? "pointer" : "default", opacity: resolvedId ? 1 : 0.7 }}
    >
      <h5>{room?.Name}</h5>
      <p><strong>Location:</strong> {room?.Location}</p>
      <p><strong>Capacity:</strong> {room?.Capacity} people</p>
      {!resolvedId && (
        <small className="text-danger">Room ID missing; cannot open details.</small>
      )}
    </div>
  );
};

export default RoomCard;
