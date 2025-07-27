import React, { useState } from 'react';
import axios from 'axios';
import './LogIn&RegisterForm.css';
import { HiOutlineUser } from "react-icons/hi";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");     
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");      
  const [success, setSuccess] = useState("");   
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();               

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        Email: email,      
        Password: password,
      });

      console.log("Response:", response.data);

      if (response.data.token && response.data.user) {
        setSuccess("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        setError("Invalid login response. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err.response || err);
      if (err.response && err.response.data) {
        setError(
          err.response.data.error ||
          err.response.data.message ||
          "Login failed. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="BG">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <div className="input-box">
            <HiOutlineUser className="icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <TbLockPassword className="icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password</a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; // ✅ corrected export name matches component
