import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomCard from "./RoomCard";  // Adjust path as necessary

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/room", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Normalize rooms' ids to a standard format
        const normalizedRooms = res.data.map((room) => ({
          ...room,
          id: room?.id ?? room?.Id ?? room?.roomId ?? room?.RoomId, // ensure `id` is always defined
        }));

        setRooms(normalizedRooms);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch rooms.");
        setLoading(false);
      });
  }, []);

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
    </div>
  );
};

export default RoomsPage;
