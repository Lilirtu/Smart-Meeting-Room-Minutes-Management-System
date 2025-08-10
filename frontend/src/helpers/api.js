// Works with Vite (import.meta.env) and CRA (process.env)
const viteBase = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE;
const craBase = typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE;

export const API_BASE = viteBase || craBase || 'http://localhost:8000/api';

export const authHeaders = () => {
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
