import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ActiveMeetingScreen.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const ActiveMeetingScreen = () => {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTranscriptionOn, setIsTranscriptionOn] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`${API_BASE}/api/meetings/${meetingId}/details`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meeting data");
        return res.json();
      })
      .then((data) => {
        setMeeting(data);
        setIsMeetingActive(Boolean(data?.starttime && !data?.endtime));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [meetingId]);

  useEffect(() => {
    if (!isMeetingActive) return;
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isMeetingActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartEnd = () => {
    const path = isMeetingActive ? "end" : "start";
    fetch(`${API_BASE}/api/meetings/${meetingId}/${path}`, { method: "PUT" })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to ${path} meeting`);
        return res.json().catch(() => ({}));
      })
      .then((payload) => {
        if (isMeetingActive) {
          setIsMeetingActive(false);
          setTimer(0);
          setMeeting((m) =>
            m ? { ...m, endtime: payload?.endtime ?? m.endtime ?? new Date().toLocaleTimeString() } : m
          );
        } else {
          setIsMeetingActive(true);
          setMeeting((m) =>
            m ? { ...m, starttime: payload?.starttime ?? m.starttime ?? new Date().toLocaleTimeString() } : m
          );
        }
      })
      .catch((e) => alert(e.message));
  };

  const toggleTranscription = () => setIsTranscriptionOn((prev) => !prev);

  const handleTakeNotes = () => alert("Open Minutes Template (Demo)");
  const handleShareScreen = () => alert("Share Screen (Demo)");
  const handleInviteParticipant = () => alert("Invite Participant (Demo)");

  if (loading) return <p>Loading meeting info...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const attendees = Array.isArray(meeting?.attendees) ? meeting.attendees : [];

  return (
    <div className="active-meeting-container">
      <h2>Active Meeting</h2>

      <div className="meeting-info">
        <h3>{meeting.title}</h3>
        <p><strong>Date:</strong> {meeting.date}</p>
        <p><strong>Start Time:</strong> {meeting.starttime || "Not started yet"}</p>
        <p><strong>End Time:</strong> {meeting.endtime || "Not ended yet"}</p>
        <p><strong>Attendees:</strong></p>
        <ul>
          {attendees.map((person, index) => (
            <li key={index}>{typeof person === "string" ? person : person?.name ?? "Unknown"}</li>
          ))}
        </ul>
      </div>

      <div className="controls">
        <button
          className={isMeetingActive ? "end-btn" : "start-btn"}
          onClick={handleStartEnd}
        >
          {isMeetingActive ? "End Meeting" : "Start Meeting"}
        </button>

        <div className="timer">
          <span>Timer: {formatTime(timer)}</span>
        </div>

        <div className="transcription-toggle">
          <input
            id="transcription"
            type="checkbox"
            checked={isTranscriptionOn}
            onChange={toggleTranscription}
          />
          <label htmlFor="transcription">Live Transcription</label>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handleTakeNotes}>Take Notes</button>
        <button onClick={handleShareScreen}>Share Screen</button>
        <button onClick={handleInviteParticipant}>Invite Participant</button>
      </div>
    </div>
  );
};

export default ActiveMeetingScreen;
