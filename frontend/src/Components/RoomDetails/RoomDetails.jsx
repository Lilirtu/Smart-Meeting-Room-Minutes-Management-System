import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8000/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRoom(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Room not found or error fetching details.");
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <p className="text-center fs-5">Loading Room...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!room) return null;

  return (
    <div className="container py-4">
      <h2>{room.Name}</h2>

      {/* Image Display */}
      {room.Image && (
        <img
          src={`http://localhost:8000/storage/${room.Image}`}
          alt={room.Name}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />
      )}

      <p><strong>Location:</strong> {room.Location}</p>
      <p><strong>Capacity:</strong> {room.Capacity} people</p>

      <h5>Features:</h5>
      {room.features && room.features.length > 0 ? (
        <ul>
          {room.features.map((f) => (
            <li key={f.id}>{f.FeatureName || f.name}</li>
          ))}
        </ul>
      ) : (
        <p>No features listed.</p>
      )}

      <button
        className="btn btn-success mt-3"
        onClick={() => navigate(`/booking/${room.id}`)}
      >
        Book This Room
      </button>
    </div>
  );
};

export default RoomDetails;
