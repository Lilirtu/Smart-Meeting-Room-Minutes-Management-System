import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // Laravel backend URL
  withCredentials: true,            // important for session cookies
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  }
});

export default instance;
