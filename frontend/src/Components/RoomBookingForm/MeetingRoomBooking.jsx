import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RoomsPage = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ✅ Authentication check (same as your working example)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    try {
      JSON.parse(user); // validate user data
    } catch (err) {
      console.error("Invalid user data:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch Rooms from your API with Bearer Token
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/roomIndex", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ API returns an array directly
        setRooms(response.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <p className="text-center py-4">Loading Rooms...</p>;
  if (error) return <p className="text-danger text-center py-4">{error}</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Available Rooms</h2>
      {rooms.length > 0 ? (
        <ul className="list-group">
          {rooms.map((room) => (
            <li key={room.id} className="list-group-item">
              {room.Name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
};

export default RoomsPage;
