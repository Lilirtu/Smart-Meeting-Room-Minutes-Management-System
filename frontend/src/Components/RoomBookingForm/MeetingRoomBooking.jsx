import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MeetingRoomBooking.css";
import axios from "axios";

const MeetingRoomBooking = () => {
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [room, setRoom] = useState(""); // selected room id as string
  const [rooms, setRooms] = useState([]); // list of rooms
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();
  const { roomId } = useParams();

  // User & token validation on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    try {
      JSON.parse(user);
      setPageLoading(false);
    } catch (err) {
      console.error("Invalid user data:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/roomIndex", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Make sure id values are strings for select comparison
        const roomsWithStringIds = response.data.map((r) => ({
          ...r,
          id: r.id.toString(),
        }));
        setRooms(roomsWithStringIds);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  // After rooms are loaded, if URL has roomId, set room state with string id
  useEffect(() => {
    if (roomId && rooms.length > 0) {
      // Convert roomId to string to match select option values
      const roomIdStr = roomId.toString();
      // Check if roomId exists in rooms list before setting
      if (rooms.some((r) => r.id === roomIdStr)) {
        setRoom(roomIdStr);
      }
    }
  }, [roomId, rooms]);

  // Find the selected room object from rooms list by room id (string)
  const selectedRoom = rooms.find((r) => r.id === room);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!room) {
      setError("Please select a room.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const emails = attendees.split(",").map((email) => email.trim()).filter(Boolean);

      if (emails.length === 0) {
        setError("Please enter at least one attendee email.");
        setLoading(false);
        return;
      }

      // Fetch user IDs for attendees
      const userResponse = await axios.post(
        "http://localhost:8000/api/usersIds",
        { emails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userIds = userResponse.data;

      // Post booking request
      const response = await axios.post(
        "http://localhost:8000/api/booking",
        {
          Status: status,
          Date: date,
          StartTime: startTime,
          EndTime: endTime,
          UserIds: userIds,
          RoomId: room,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      setSuccess("Room booked successfully!");
      // Reset form fields
      setStatus("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setAttendees("");
      setRoom(""); // Clear room selection on success
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response);
        if (err.response.data.errors) {
          const firstKey = Object.keys(err.response.data.errors)[0];
          setError(err.response.data.errors[firstKey][0]);
        } else {
          setError(err.response.data.message || "Booking failed");
        }
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <p className="text-center text-secondary fs-5">Loading...</p>;

  return (
    <div className="container">
      <h1>Book a Meeting Room</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="status"
          placeholder="Meeting Title"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        <div>
          <h5>Date:</h5>
          <input
            type="date"
            name="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <h5>From:</h5>
          <input
            type="time"
            name="startTime"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <h5>To:</h5>
          <input
            type="time"
            name="endTime"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <textarea
          name="attendees"
          placeholder="Attendees (comma-separated emails)"
          value={attendees}
          onChange={(e) => {
            setAttendees(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          rows={1}
        />

        <select
          name="room"
          required
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option value="">Select Room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.Name}
            </option>
          ))}
        </select>

        {/* Show the selected room name below the select (optional) */}
        {room && selectedRoom && (
          <p>
            Selected Room: <strong>{selectedRoom.Name}</strong>
          </p>
        )}

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Now"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (roomId) {
                navigate(`/rooms/${roomId}`);
              } else {
                navigate("/dashboard");
              }
            }}
          >
            Cancel
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default MeetingRoomBooking;
