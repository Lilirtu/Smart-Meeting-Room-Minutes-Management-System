import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubmitAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [file, setFile] = useState(null);

  const [pageLoading, setPageLoading] = useState(true); // loading the assignment list
  const [loading, setLoading] = useState(false);        // submitting the form
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load assignments for the dropdown
  useEffect(() => {
    const fetchAssignments = async () => {
      setPageLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/assignments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Expecting an array like [{ id, title }] — adjust mapping if your API differs
        setAssignments(res.data || []);
      } catch (err) {
        setError('Failed to load assignments. ' + (err.response?.data?.message || err.message));
      } finally {
        setPageLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedId) {
      setError('Please select an assignment.');
      return;
    }
    if (!file) {
      setError('Please choose a file to submit.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('submission', file);

      await axios.post(
        `http://localhost:8000/api/assignments/${selectedId}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('File submitted successfully!');
      setFile(null);
      // keep the same assignment selected
    } catch (err) {
      setError('Error submitting file: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <p>Loading assignments…</p>;

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 16 }}>Submit Your Assignment</h2>

      <form onSubmit={handleSubmit}>
        {/* Assignment selector */}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="assignment" style={{ display: 'block', marginBottom: 6 }}>
            Select assignment
          </label>
          <select
            id="assignment"
            className="form-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">— Choose an assignment —</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title || `Assignment #${a.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* File input */}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="file" style={{ display: 'block', marginBottom: 6 }}>
            Upload file
          </label>
          <input
            id="file"
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <small style={{ display: 'block', marginTop: 6 }}>
              Selected: <strong>{file.name}</strong>
            </small>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !selectedId || !file}
        >
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>

      {!!error && <p className="text-danger" style={{ marginTop: 12 }}>{error}</p>}
      {!!success && <p className="text-success" style={{ marginTop: 12 }}>{success}</p>}

      {assignments.length === 0 && !error && (
        <p style={{ marginTop: 12 }}>No assignments available.</p>
      )}
    </div>
  );
};

export default SubmitAssignment;
