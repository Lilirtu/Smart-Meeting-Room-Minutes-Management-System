import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoomCard from "./RoomCard";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/roomIndex", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch rooms.");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <p className="text-center">Loading Rooms...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Available Rooms</h2>
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard key={room.id} room={room} />)
      ) : (
        <p>No rooms available.</p>
      )}

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Go Back
        </button> 
    </div>
  );
};

export default RoomsPage;
