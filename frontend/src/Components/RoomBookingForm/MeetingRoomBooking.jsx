import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MeetingRoomBooking.css";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

const MeetingRoomBooking = () => {
  const navigate = useNavigate();

  // accept either /booking/:id or /booking/:roomId
  const { id: idParam, roomId: roomIdParam } = useParams();
  const preselectId = (idParam ?? roomIdParam) ? String(idParam ?? roomIdParam) : null;

  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState("");

  const [room, setRoom] = useState("");      // selected room id (string)
  const [rooms, setRooms] = useState([]);    // list of rooms
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Validate token/user on load
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
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/roomIndex`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Handle both array and { data: [...] } payloads
        const payload = res.data;
        const rawList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];

        // Normalize IDs and names
        const list = rawList.map((r) => ({
          ...r,
          id: String(r.id ?? r.Id ?? r.ID),
          Name: r.Name ?? r.name ?? `Room ${r.id ?? r.Id ?? r.ID}`,
        }));

        setRooms(list);

        // Preselect if URL had an id and it exists
        if (preselectId && list.some((x) => x.id === preselectId)) {
          setRoom(preselectId);
        }
        if (!list.length) {
          setError("No rooms found. Please add rooms or check your API endpoint.");
        }
      } catch (e) {
        console.error("Error fetching rooms:", e);
        setError(
          e?.response?.data?.message ||
            "Failed to load rooms. Check your token and API (/api/roomIndex)."
        );
      }
    };
    fetchRooms();
  }, [preselectId]);

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
      const emails = attendees
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      if (!emails.length) {
        setError("Please enter at least one attendee email.");
        setLoading(false);
        return;
      }

      // Resolve attendee user IDs
      const userRes = await axios.post(
        `${API_BASE}/usersIds`,
        { emails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userIds = userRes.data;

      // Create booking
      await axios.post(
        `${API_BASE}/booking`,
        {
          Status: status,
          Date: date,          // YYYY-MM-DD
          StartTime: startTime, // HH:mm
          EndTime: endTime,     // HH:mm
          UserIds: userIds,
          RoomId: Number(room), // backend likely expects a number
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Room booked successfully!");
      setStatus("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setAttendees("");
      setRoom("");
    } catch (err) {
      console.error("Booking error:", err?.response || err);
      if (err?.response?.data?.errors) {
        const firstKey = Object.keys(err.response.data.errors)[0];
        setError(err.response.data.errors[firstKey][0]);
      } else {
        setError(err?.response?.data?.message || "Booking failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <p className="text-center text-secondary fs-5">Loading…</p>;

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

        <label style={{ marginTop: 8, marginBottom: 4 }}>Room</label>
        <select
          name="room"
          required
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          disabled={!rooms.length}
        >
          <option value="">{rooms.length ? "Select Room" : "No rooms available"}</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.Name} (ID {r.id})
            </option>
          ))}
        </select>

        {room && selectedRoom && (
          <p>
            Selected Room: <strong>{selectedRoom.Name}</strong>
          </p>
        )}

        <div className="button-group">
          <button type="submit" disabled={loading || !rooms.length}>
            {loading ? "Booking..." : "Book Now"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (preselectId) navigate(`/rooms/${preselectId}`);
              else navigate("/dashboard");
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
