const API=import.meta.env.VITE_API_URL;
import axios from 'axios';

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});
