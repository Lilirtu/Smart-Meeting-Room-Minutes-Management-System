import React, { useState } from 'react';
import axios from 'axios';
import '../LogInForm/LogIn&RegisterForm.css';


const RegisterForm = () => {
  const [FullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
        setError("Passwords do not match!");
        return;
    }
    setError('');

    try {
      // STEP 1: Get CSRF cookie for Sanctum session auth
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {withCredentials: true});

      // STEP 2: Send login request - use lowercase keys `email` & `password`
      const response = await axios.post('http://localhost:8000/register', {
        Email: username,      // Laravel expects `email`
        Password: password,   // and `password`
      }, {withCredentials: true});

      console.log('Register successful:', response.data);
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
    <div className='BG'>
      <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Register Employee</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="input-box">
          <input
            type="text"
            placeholder='Employee s Full Name'
            required
            value={FullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>


        <div className="input-box">
          <input
            type="text"
            placeholder='Email'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder='Confirm Password'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="input-box">
            <select value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required>
                <option value="" disabled>
                    Select a role
                </option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="guest">Guest</option>        
            </select>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
    </div>
  );
};

export default RegisterForm;
