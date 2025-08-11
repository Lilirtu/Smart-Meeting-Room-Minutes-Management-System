import '../LogInForm/LogIn&RegisterForm.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [FullName, setFullName] = useState("");         
  const [email, setEmail] = useState("");                
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");                     
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if logged user is admin, redirect if not
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || Number(user.role ?? user.RoleId) !== 1) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        FullName,
        Email: email,      
        Password: password,  
        RoleId: role,
      });

      console.log("Response:", response.data);
      setSuccess("Registration successful! Please log in.");
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.error("Error response:", err.response);
        if (err.response.data.errors) {
          const firstKey = Object.keys(err.response.data.errors)[0];
          setError(err.response.data.errors[firstKey][0]);
        } else {
          setError(err.response.data.message || "Registration failed");
        }
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="BG">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Register Employee</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <div className="input-box">
            <input
              type="text"
              placeholder="Employee's Full Name"
              required
              value={FullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="input-box">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="1">Admin</option>
              <option value="2">Employee</option>
              <option value="3">Guest</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
