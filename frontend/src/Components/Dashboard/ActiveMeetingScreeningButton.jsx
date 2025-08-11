import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function parseWindow(m) {
  try {
    if (!m) return {};
    // Full datetime fields
    const sdt = m.StartDateTime || m.startDateTime || m.start_datetime;
    const edt = m.EndDateTime || m.endDateTime || m.end_datetime;
    if (sdt || edt) {
      return {
        start: sdt ? new Date(sdt) : null,
        end: edt ? new Date(edt) : null,
      };
    }
    // Separate date + time fields (case-insensitive)
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

function hasStarted(m, now) {
  const { start, end } = parseWindow(m);
  const started = start ? now >= start : true;
  const notEnded = end ? now <= end : true;
  return Boolean(started && notEnded);
}

function belongsToUser(m, userId) {
  if (!userId || !m) return false;

  // Common owner fields
  const ownerFields = ["UserId", "userId", "user_id", "OwnerId", "CreatedBy", "OrganizerId", "organizer_id"];
  for (const f of ownerFields) {
    if (m[f] !== undefined && Number(m[f]) === Number(userId)) return true;
  }

  // Participants arrays (ids or objects)
  const participantFields = ["Participants", "participants", "Attendees", "attendees"];
  for (const f of participantFields) {
    const arr = m[f];
    if (Array.isArray(arr)) {
      // e.g., [1,2,3] or [{UserId:1},{id:2}, ...]
      for (const item of arr) {
        if (typeof item === "number" && Number(item) === Number(userId)) return true;
        if (item && (Number(item.UserId) === Number(userId) || Number(item.id) === Number(userId))) return true;
      }
    }
  }

  return false;
}

export default function ActiveMeetingScreeningButton({ userId }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [meetingIdInput, setMeetingIdInput] = useState("");

  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !userId) {
      setChecking(false);
      return;
    }

    const fetchFromIndex = async () => {
      setChecking(true);
      try {
        // Primary: /api/meeting (apiResource index)
        const { data } = await axios.get("http://localhost:8000/api/meeting", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        // Filter to meetings that belong to this user
        const mine = list.filter((m) => belongsToUser(m, userId));

        // Among mine, find the one that has started (and not ended). If multiple, pick the latest started.
        const started = mine.filter((m) => hasStarted(m, now));
        started.sort((a, b) => {
          const as = parseWindow(a).start?.getTime() ?? 0;
          const bs = parseWindow(b).start?.getTime() ?? 0;
          return bs - as;
        });

        setActiveMeeting(started[0] || null);
      } catch {
        // If /api/meeting is unavailable, just fall back to manual entry
        setActiveMeeting(null);
      } finally {
        setChecking(false);
      }
    };

    fetchFromIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (checking) {
    return <div style={{ marginTop: 16 }}><p className="text-muted">Checking active meetings…</p></div>;
  }

  // If a started meeting exists, show the direct button
  if (activeMeeting && hasStarted(activeMeeting, now)) {
    const id = activeMeeting.id || activeMeeting.MeetingId || activeMeeting.meetingId;
    if (id) {
      return (
        <div style={{ marginTop: 16 }}>
          <button
            className="custom-button"
            type="button"
            style={{ width: "100%" }}
            onClick={() => navigate(`/minutes/${id}`)}
          >
            Add Minutes for Active Meeting
          </button>
        </div>
      );
    }
  }

  // Otherwise hide quietly, but provide a compact manual fallback if needed
  return (
    <div style={{ marginTop: 16 }}>
      <button
        className="custom-button"
        type="button"
        onClick={() => setManualOpen((s) => !s)}
        style={{ width: "100%" }}
      >
        Open Meeting By ID
      </button>

      {manualOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const cleaned = meetingIdInput.trim();
            if (cleaned) navigate(`/minutes/${cleaned}`);
          }}
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            background: "var(--card-bg, #fff)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            display: "grid",
            gap: 8,
          }}
        >
          <label htmlFor="meeting-id" style={{ fontWeight: 600 }}>Meeting ID</label>
          <input
            id="meeting-id"
            type="text"
            placeholder="e.g., 1"
            value={meetingIdInput}
            onChange={(e) => setMeetingIdInput(e.target.value)}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="custom-button"
              onClick={() => { setManualOpen(false); setMeetingIdInput(""); }}
              style={{ background: "#e5e7eb", color: "#111827" }}
            >
              Cancel
            </button>
            <button type="submit" className="custom-button">Open</button>
          </div>
        </form>
      )}
    </div>
  );
}
