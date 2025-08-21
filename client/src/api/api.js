import axios from 'axios';
import config from '../devprodConfig'

const API_URL = config.apiBaseUrl;

export const searchKiinteistot = (kiinteistotunnus = '', osoite = '', kaupunki = '') => {
  console.log(kiinteistotunnus, osoite, kaupunki);
  return axios.get(`${API_URL}/api/haku/hae-kiinteistoja`, {
    withCredentials: true,
    params: {
      kiinteistotunnus: kiinteistotunnus || undefined,
      osoite: osoite || undefined,
      kaupunki: kaupunki || undefined,
    }
  });
};

export const getKiinteistot = () =>
  axios.get(`${API_URL}/api/kiinteistot/default`, {
    withCredentials: true
  });

export const getKiinteistotWithRakennukset = (
  page = 1,
  limit = 6,
  orderBy = 'id_kiinteisto',
  orderDir = 'ASC',
  searchTerm = '' 
  ) =>
  axios.get(`${API_URL}/api/kiinteistot/with-rakennukset`, {
    withCredentials: true,
    params: {
      page,
      limit,
      orderBy,
      orderDir,
      searchTerm: searchTerm, 
    },
  });

export const getKiinteistoWhole = (id) =>
  axios.get(`${API_URL}/api/kiinteistot/with-rakennukset/by/id/${id}`, {
    withCredentials: true
  })


export const createKiinteisto = (data) =>
  axios.post(
    `${API_URL}/api/kiinteistot/with-rakennukset`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );

export const updateRakennus = (id, data) => {
  console.log('updateRakennus payload:', data);

  return axios.put(
    `${API_URL}/api/rakennukset_full/${id}/with-metadata`,  
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
};

export const getIndicatorValueByKuntaName = (indicatorId, kuntaName, years) => {
  return axios.get(`${API_URL}/api/tilastot/get-indicator-value-by-kunta-name`, {
    withCredentials: true,
    params: {
      indicatorId,
      kuntaName,
      years: years.join(','),
    }
  });
};

//PTS labelien haku

export const getLabelsByCategoryAndSection = (category = '', section = '') => {
  return axios.get(`${API_URL}/api/pts/by/get-labels-by-category-and-section`, {
    withCredentials: true,
    params: {
      category: category || undefined,
      section: section || undefined,
    },
  });
};