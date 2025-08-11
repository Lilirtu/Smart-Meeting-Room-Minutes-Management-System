// ActiveMeetingScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

export default function ActiveMeetingScreen() {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  // Data/state
  const [meeting, setMeeting] = useState(null);
  const [minutesList, setMinutesList] = useState([]);
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  // Form
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [decisionMade, setDecisionMade] = useState("");

  // UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const abortRef = useRef(null);

  // ---------- Helpers ----------
  const baseHeaders = useMemo(() => {
    const token = localStorage.getItem("token") || "";
    return {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const jsonHeaders = useMemo(
    () => ({ ...baseHeaders, "Content-Type": "application/json" }),
    [baseHeaders]
  );

  const parseJsonOrThrow = async (res, defaultMsg = "Request failed") => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthenticated - redirecting to login.");
    }
    if (!res.ok) {
      let msg = defaultMsg;
      try {
        const body = await res.json();
        msg = body?.message || msg;
      } catch (_) {}
      throw new Error(msg);
    }
    try {
      return await res.json();
    } catch {
      throw new Error(defaultMsg);
    }
  };

  const refreshDetails = async (signal) => {
    const detRes = await fetch(
      `${API_BASE}/api/meetings/${meetingId}/details`,
      { method: "GET", headers: baseHeaders, signal }
    );
    const det = await parseJsonOrThrow(detRes, "Failed to load meeting");
    setMeeting(det);
    setIsMeetingActive(Boolean(det?.starttime && !det?.endtime));
    return det;
  };

  const refreshMinutes = async (signal) => {
    const minRes = await fetch(
      `${API_BASE}/api/meetings/${meetingId}/minutes`,
      { method: "GET", headers: baseHeaders, signal }
    );
    if (!minRes.ok) {
      setMinutesList([]);
      return;
    }
    const mins = await minRes.json();
    setMinutesList(Array.isArray(mins) ? mins : []);
  };

  // ---------- Effects ----------
  useEffect(() => {
    setError("");
    setLoading(true);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        await refreshDetails(controller.signal);
        await refreshMinutes(controller.signal);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Error loading data");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [API_BASE, meetingId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Actions ----------
  const putMeetingState = async (path) => {
    setError("");
    setInfo("");
    const res = await fetch(`${API_BASE}/api/meetings/${meetingId}/${path}`, {
      method: "PUT",
      headers: baseHeaders,
    });
    await parseJsonOrThrow(res, `Failed to ${path} meeting`);
    await refreshDetails();
    setInfo(
      path === "start"
        ? "Meeting started. You can now add minutes below."
        : "Meeting ended. You can still view previously saved minutes."
    );
  };

  const handleStart = async () => {
    try {
      await putMeetingState("start");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEnd = async () => {
    try {
      await putMeetingState("end");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    setError("");
    setInfo("");

    const hasContent =
      topic.trim().length || summary.trim().length || decisionMade.trim().length;
    if (!hasContent) {
      setError("Please fill at least one field to save minutes.");
      return;
    }
    if (!isMeetingActive) {
      setError("You need to start the meeting before saving minutes.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/meetings/${meetingId}/minutes`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          Topic: topic.trim(),
          Summary: summary.trim(),
          DecisionMade: decisionMade.trim(),
        }),
      });
      const saved = await parseJsonOrThrow(res, "Failed to save minutes");
      setMinutesList((prev) => [saved.data || saved, ...prev]);
      setTopic("");
      setSummary("");
      setDecisionMade("");
      setInfo("Minutes saved.");
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- Render ----------
  if (loading) return <div style={{ padding: 16 }}>Loading meeting…</div>;

  const statusPill = (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: isMeetingActive ? "#e7f7ed" : "#f3f4f6",
        color: isMeetingActive ? "#0f5132" : "#374151",
        border: `1px solid ${isMeetingActive ? "#badbcc" : "#d1d5db"}`,
      }}
    >
      {isMeetingActive ? "In Progress" : "Not started / Ended"}
    </span>
  );

  const saveDisabled =
    saving ||
    !isMeetingActive ||
    (!topic.trim() && !summary.trim() && !decisionMade.trim());

  return (
    <div style={{ padding: 16, maxWidth: 880, margin: "0 auto" }}>
      {error && (
        <div style={{ background: "#fde2e1", padding: 8, marginBottom: 12 }}>
          Error: {error}
        </div>
      )}
      {info && (
        <div style={{ background: "#e7f1ff", padding: 8, marginBottom: 12 }}>
          {info}
        </div>
      )}

      <button onClick={() => navigate(-1)}>← Back</button>

      <h1>
        Active Meeting {meeting ? `#${meeting.id}` : ""} {statusPill}
      </h1>

      
    

      <form onSubmit={handleSave}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic"
        />
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summary"
        />
        <textarea
          value={decisionMade}
          onChange={(e) => setDecisionMade(e.target.value)}
          placeholder="Decision Made"
        />
        <button type="submit" disabled={saveDisabled}>
          {saving ? "Saving..." : "Save Minutes"}
        </button>
      </form>

      <h2>Minutes</h2>
      {minutesList.length === 0 ? (
        <div>No minutes yet.</div>
      ) : (
        <ul>
          {minutesList.map((m) => (
            <li key={m.id}>
              <strong>{m.Topic}</strong> — {m.Summary} — {m.DecisionMade}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
