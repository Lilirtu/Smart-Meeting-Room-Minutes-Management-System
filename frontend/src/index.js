import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';       // <-- Import axios here
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Axios global config for CSRF and credentials
axios.defaults.withCredentials = true;               // send cookies
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';         // cookie name (default)
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';       // header name (default)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
