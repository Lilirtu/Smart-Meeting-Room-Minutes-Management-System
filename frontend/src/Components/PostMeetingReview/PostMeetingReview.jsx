import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PostMeetingReview.css";
import { useNavigate } from "react-router-dom";

const PostMeetingReview = () => {
  const [meetingId, setMeetingId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true); // for page loading state
  const navigate = useNavigate();

  // ✅ Authentication check (same logic from MinutesForm)
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

  const handleSearch = async () => {
    if (!meetingId.trim()) {
      setError("Please enter a Meeting ID.");
      setData(null);
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve token for auth

    try {
      // ✅ Send GET request with the token to authenticate the user
      const response = await axios.get(
        `http://localhost:8000/api/post-meeting-review/${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setError(""); // Reset error message
    } catch (err) {
      setData(null);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  if (pageLoading) return <p className="text-center text-secondary fs-5">Loading...</p>;

  return (
    <div className="review-container">
      <h2>Post Meeting Review</h2>

      {/* Search Input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Meeting ID"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Display Data */}
      {data && (
        <div className="results">
          {/* Meeting Info */}
          <section>
            <h3>Meeting Info</h3>
            <p><strong>Title:</strong> {data.meeting.Title}</p>
            <p><strong>Date:</strong> {data.meeting.Date}</p>
            <p><strong>Start:</strong> {data.meeting.StartTime}</p>
            <p><strong>End:</strong> {data.meeting.EndTime}</p>
          </section>

          {/* Minutes of Meeting */}
          {data.minutes && (
            <section>
              <h3>Minutes of Meeting</h3>
              <p><strong>Summary:</strong> {data.minutes.Summary}</p>
              <p><strong>Decision Made:</strong> {data.minutes.DecisionMade}</p>
            </section>
          )}

          {/* Attachments */}
          <section>
            <h3>Attachments</h3>
            {data.attachments.length > 0 ? (
              <ul>
                {data.attachments.map((file, i) => (
                  <li key={i}>
                    <a href={file.Link} target="_blank" rel="noopener noreferrer">
                      {file.FileName}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attachments found.</p>
            )}
          </section>

          {/* Assignments */}
          <section>
            <h3>Your Assignments</h3>
            {data.assignments.length > 0 ? (
              <ul>
                {data.assignments.map((a, i) => (
                  <li key={i}>
                    <p><strong>Description:</strong> {a.Description}</p>
                    <p><strong>Due Date:</strong> {a.DueDate}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No assignments found for you.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default PostMeetingReview;
