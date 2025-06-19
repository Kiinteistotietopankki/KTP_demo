import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_DEV;
const API_KEY = process.env.REACT_APP_PERSONAL_API_KEY; 


export const getKiinteistot = () =>
  axios.get(`${API_URL}/api/kiinteistot/default`, {
    headers: {
      'x-api-key': API_KEY 
    }
  });

export const getKiinteistotWithData = (order='DESC', page=1, searchTerm='') =>
  axios.get(`${API_URL}/api/kiinteistot/basic-data?page=${page}&pageSize=5&order=${order}&searchTerm=${searchTerm}`, {
    headers: {
      'x-api-key': API_KEY 
    }
  });


export const getKiinteistoWhole = (id) =>
  axios.get(`${API_URL}/api/kiinteistot/full/${id}`, {
    headers: {
      'x-api-key' : API_KEY
    }
  })


export const createKiinteisto = (data) =>
  axios.post(
    `${API_URL}/api/kiinteistot/default`,
    data, // JSON payload
    {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );