import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MeetingRoomBooking.css";
import axios from "axios";

const MeetingRoomBooking = () => {
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState(""); // emails input
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]); // fetched rooms
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    try {
      JSON.parse(user); // validate user data
      setPageLoading(false);
    } catch (err) {
      console.error("Invalid user data:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch available rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/roomIndex", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRooms(response.data); // expects array of rooms [{id, Name}]
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      // ✅ Convert attendees (emails) to User IDs
      const emails = attendees.split(",").map((email) => email.trim());
      const userResponse = await axios.post(
        "http://localhost:8000/api/usersIds",
        { emails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userIds = userResponse.data; // expected: [1, 2, 3]

      // ✅ Submit booking request
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
      setStatus("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setAttendees("");
      setRoom("");
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
    <div className="booking-container">
      <h1>Book a Meeting Room</h1>
      <form onSubmit={handleSubmit} className="booking-form">
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

        <input
          type="text"
          name="attendees"
          placeholder="Attendees (comma-separated emails)"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
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

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Now"}
          </button>
          <button type="reset">Cancel</button>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default MeetingRoomBooking;
