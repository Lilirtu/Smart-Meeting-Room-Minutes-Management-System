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
        setRoom({
          ...res.data,
          Image: res.data.ImageUrl,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Room not found or error fetching details.");
        setLoading(false);
      });
  }, [id, navigate]);

  const handleBooking = () => {
    navigate(`/booking/${room.id}`);
  };

  if (loading) return <p className="text-center fs-5">Loading Room...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!room) return null;

  return (
    <div className="container py-4">
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
        <button className="btn btn-success" onClick={handleBooking}>
          Book Room
        </button>
      </div>
      <h2>{room.Name}</h2>
      {room.Image && (
        <img
          src={room.Image}
          alt={room.Name}
          className="img-fluid mb-3"
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      )}
      <p><strong>Location:</strong> {room.Location}</p>
      <p><strong>Capacity:</strong> {room.Capacity} people</p>
      <h5>Features:</h5>
      {room.features && room.features.length > 0 ? (
        <ul>
          {room.features.map((f) => (
            <li key={f.id}>{f.FeatureName}</li>
          ))}
        </ul>
      ) : (
        <p>No features listed.</p>
      )}
    </div>
  );
};

export default RoomDetails;
