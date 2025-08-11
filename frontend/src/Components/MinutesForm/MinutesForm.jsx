import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../RoomBookingForm/MeetingRoomBooking.css";
import axios from "axios";

function parseWindow(m) {
  try {
    if (!m) return {};
    const sdt = m.StartDateTime || m.startDateTime || m.start_datetime;
    const edt = m.EndDateTime || m.endDateTime || m.end_datetime;
    if (sdt || edt) {
      return {
        start: sdt ? new Date(sdt) : null,
        end: edt ? new Date(edt) : null,
      };
    }
    const date = m.Date || m.date || m.MeetingDate || m.meetingDate;
    const startStr =
      m.StartTime || m.start_time || m.start || m.MeetingStartTime || m.starttime;
    const endStr =
      m.EndTime || m.end_time || m.end || m.MeetingEndTime || m.endtime;

    const start = (date && startStr) ? new Date(`${date}T${startStr}`) : (startStr ? new Date(startStr) : null);
    const end   = (date && endStr)   ? new Date(`${date}T${endStr}`)   : (endStr ? new Date(endStr) : null);
    return { start, end };
  } catch {
    return {};
  }
}

const MinutesForm = () => {
  const { meetingId } = useParams();
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [decisionMade, setDecisionMade] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [allowedNow, setAllowedNow] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      navigate("/login");
      return;
    }

    try { JSON.parse(userRaw); } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    const fetchDetails = async () => {
      if (!meetingId) {
        setPageLoading(false);
        setAllowedNow(true);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8000/api/meetings/${meetingId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || {};
        setMeeting(data);

        const { start, end } = parseWindow(data);
        const now = new Date();
        const started = start ? now >= start : true;
        const notEnded = end ? now <= end : true;
        setAllowedNow(Boolean(started && notEnded));
      } catch (err) {
        // If details can’t be fetched, keep form accessible (you can hard-block if you prefer)
        setAllowedNow(true);
      } finally {
        setPageLoading(false);
      }
    };

    fetchDetails();
  }, [navigate, meetingId]);

  const windowText = useMemo(() => {
    const { start, end } = parseWindow(meeting || {});
    const fmt = (d) =>
      d
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        : 'N/A';
    if (!meeting) return null;
    return `Window: ${fmt(start)} → ${fmt(end)}`;
  }, [meeting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const payload = {
        Topic: topic,
        Summary: summary,
        DecisionMade: decisionMade,
      };
      if (meetingId) payload.MeetingId = Number(meetingId);

      const response = await axios.post(
        "http://localhost:8000/api/minutes_of_meeting",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Minutes saved successfully!");
      setTopic("");
      setSummary("");
      setDecisionMade("");
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstKey = Object.keys(err.response.data.errors)[0];
        setError(err.response.data.errors[firstKey][0]);
      } else {
        setError(err.response?.data?.message || "Saving failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <p className="text-center text-secondary fs-5">Loading...</p>;

  if (!allowedNow) {
    return (
      <div className="container">
        <h1>Minutes Of Meeting</h1>
        <p className="error">You can add minutes only once the meeting has started.</p>
        {windowText && <p className="info">{windowText}</p>}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Minutes Of Meeting {meetingId ? `#${meetingId}` : ""}</h1>
      {windowText && <p className="info" style={{ marginBottom: 12 }}>{windowText}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="topic"
          placeholder="Topic"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <textarea
          name="summary"
          placeholder="Summary"
          required
          value={summary}
          onChange={(e) => {
            setSummary(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          rows={1}
        />

        <textarea
          name="DecisionMade"
          placeholder="Decision Made"
          required
          value={decisionMade}
          onChange={(e) => {
            setDecisionMade(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          rows={1}
        />

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="reset" onClick={() => {
            setTopic("");
            setSummary("");
            setDecisionMade("");
          }}>
            Cancel
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default MinutesForm;
