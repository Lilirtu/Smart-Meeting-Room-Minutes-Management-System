import React, { useState, useEffect } from "react";
import "./ActiveMeetingScreen.css";

const ActiveMeetingScreen = () => {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTranscriptionOn, setIsTranscriptionOn] = useState(false);

  const MEETING_ID = 1; // replace with dynamic value later

  useEffect(() => {
    fetch(`http://localhost:8000/api/meetings/${MEETING_ID}/details`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meeting data");
        return res.json();
      })
      .then((data) => {
        setMeeting(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (isMeetingActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isMeetingActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartEnd = () => {
    if (isMeetingActive) {
      fetch(`http://localhost:8000/api/meetings/${MEETING_ID}/end`, { method: "PUT" })
        .then((res) => res.json())
        .then(() => {
          setIsMeetingActive(false);
          setTimer(0);
        })
        .catch(() => alert("Failed to end meeting"));
    } else {
      fetch(`http://localhost:8000/api/meetings/${MEETING_ID}/start`, { method: "PUT" })
        .then((res) => res.json())
        .then(() => setIsMeetingActive(true))
        .catch(() => alert("Failed to start meeting"));
    }
  };

  const toggleTranscription = () => setIsTranscriptionOn((prev) => !prev);

  const handleTakeNotes = () => alert("Open Minutes Template (Demo)");
  const handleShareScreen = () => alert("Share Screen (Demo)");
  const handleInviteParticipant = () => alert("Invite Participant (Demo)");

  if (loading) return <p>Loading meeting info...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

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
          {meeting.attendees &&
            meeting.attendees.map((person, index) => (
              <li key={index}>{person}</li>
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
          <label>
            <input
              type="checkbox"
              checked={isTranscriptionOn}
              onChange={toggleTranscription}
            />
            Live Transcription
          </label>
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
