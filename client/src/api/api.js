import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_DEV;
const API_KEY = process.env.REACT_APP_PERSONAL_API_KEY; 


export const getKiinteistot = () =>
  axios.get(`${API_URL}/api/kiinteistot/default`, {
    headers: {
      'x-api-key': API_KEY 
    },
    withCredentials: true
  });

export const getKiinteistotWithRakennukset = (
  page = 1,
  limit = 6,
  orderBy = 'id_kiinteisto',
  orderDir = 'ASC',
  searchTerm = '' // new param with default empty string
) =>
  axios.get(`${API_URL}/api/kiinteistot/with-rakennukset`, {
    headers: {
      'x-api-key': API_KEY,
    },
    withCredentials: true,
    params: {
      page,
      limit,
      orderBy,
      orderDir,
      searchTerm: searchTerm,  // add search param here
    },
  });

export const getKiinteistoWhole = (id) =>
  axios.get(`${API_URL}/api/kiinteistot/with-rakennukset/by/id/${id}`, {
    headers: {
      'x-api-key' : API_KEY
    },
    withCredentials: true
  })


export const createKiinteisto = (data) =>
  axios.post(
    `${API_URL}/api/kiinteistot/with-rakennukset`,
    data,
    {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );

export const updateRakennus = (id, data) => {
  console.log('updateRakennus payload:', data);

  return axios.put(
    `${API_URL}/api/rakennukset_full/${id}/with-metadata`,  // <-- use template literal correctly here
    data,
    {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
};