import axios from 'axios';

const API_BASE = 'http://localhost:3001';
const API_KEY = 'test_apikey'; 

export const getKiinteistot = () =>
  axios.get(`${API_BASE}/kiinteistot`, {
    headers: {
      'x-api-key': API_KEY 
    }
  });
