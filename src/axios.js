import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://movie-muse.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;