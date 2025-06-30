import React, { useState } from 'react';
import axios from 'axios';
import './LogIn&RegisterForm.css';
import { HiOutlineUser } from "react-icons/hi";
import { TbLockPassword } from "react-icons/tb";

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // STEP 1: Get CSRF cookie for Sanctum session auth
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {withCredentials: true});

      // STEP 2: Send login request - use lowercase keys `email` & `password`
      const response = await axios.post('http://localhost:8000/login', {
        Email: email,      // Laravel expects `email`
        Password: password,   // and `password`
      }, {withCredentials: true});

      console.log('Login successful:', response.data);
      // Redirect or update UI after successful login here

    } catch (err) {
      if (err.response) {
        console.error("Server responded with error:", err.response.status, err.response.data);
      } else if (err.request) {
        console.error("Request made but no response received:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className = "BG"> 
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>LogIn</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="input-box">
            <HiOutlineUser className='icon' />
            <input
              type="email"
              placeholder='Email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <TbLockPassword className='icon' />
            <input
              type="password"
              placeholder='Password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="remember-forgot">
            <label >
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password</a>
          </div>
          <button type="submit">LogIn</button>
        </form>
      </div>
    </div>
  );
};

export default LogInForm;
