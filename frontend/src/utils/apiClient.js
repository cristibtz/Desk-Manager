import axios from 'axios';

export const createApiClient = (token) => {
  return axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
};

