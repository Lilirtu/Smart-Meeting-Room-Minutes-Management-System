import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

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
    if (!id || isNaN(Number(id))) {
      setError("Invalid room ID in URL.");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await axios.get(`${API_BASE}/room/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // normalize id -> room.id
        const data = res.data || {};
        setRoom({
          ...data,
          id: data.id ?? data.Id ?? data.ID,
        });
      } catch {
        setError("Room not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate]);

  const handleBooking = () => {
    if (room?.id) navigate(`/booking/${room.id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h3 className="mb-3">{room.Name}</h3>
      {room.ImageUrl && (
        <img
          src={room.ImageUrl}
          alt={room.Name}
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      )}

      <p><strong>Location:</strong> {room.Location}</p>
      <p><strong>Capacity:</strong> {room.Capacity} people</p>

      <h5>Features:</h5>
      {room.features?.length ? (
        <ul>
          {room.features.map((f) => (
            <li key={f.id ?? f.Id}>{f.FeatureName}</li>
          ))}
        </ul>
      ) : (
        <p>No features listed.</p>
      )}

      <div className="mt-4">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleBooking}
          disabled={!room?.id}
        >
          Book Room
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
