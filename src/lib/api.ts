import axios from 'axios';

// Basic configured axios instance for future API calls
export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
