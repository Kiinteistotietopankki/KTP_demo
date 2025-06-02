import axios from 'axios';

const API_BASE = 'http://localhost:3001';
const API_KEY = 'test_apikey'; 

export const getKiinteistot = () =>
  axios.get(`${API_BASE}/api/kiinteistot`, {
    headers: {
      'x-api-key': API_KEY 
    }
  });


export const createKiinteisto = (data) =>
  axios.post(
    `${API_BASE}/api/kiinteistot/create`,
    data, // JSON payload
    {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );