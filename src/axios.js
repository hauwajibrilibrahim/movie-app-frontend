import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://movie-muse.onrender.com', 
  withCredentials: false, 
});

export default instance;
