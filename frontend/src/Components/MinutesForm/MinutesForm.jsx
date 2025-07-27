import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../RoomBookingForm/MeetingRoomBooking.css";
import axios from "axios";

const MinutesForm = () => {
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [decisionMade, setDecisionMade] = useState("");
  const [assignement, setAssignement] = useState("");
  const [employee, setEmployee] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      // ✅ Submit booking request
      const response = await axios.post(
        "http://localhost:8000/api/minutes_of_meeting",
        {
          Topic: topic,
          Summary: summary,
          DecisionMade: decisionMade,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      setSuccess("Minutes saved successfully!");
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response);
        if (err.response.data.errors) {
          const firstKey = Object.keys(err.response.data.errors)[0];
          setError(err.response.data.errors[firstKey][0]);
        } else {
          setError(err.response.data.message || "Saving failed");
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
      <h1>Minutes Of Meeting</h1>
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
    e.target.style.height = 'auto'; // Reset height
    e.target.style.height = e.target.scrollHeight + 'px'; // Set new height
  }}
  rows={1} // Start with one line
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
          <button type="reset">Cancel</button>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default MinutesForm;
