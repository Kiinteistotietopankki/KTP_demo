import axios from 'axios';
import config from '../devprodConfig';

const API_URL = config.apiBaseUrl;



export const getRasitustodistus = (ktunnus, withPersonalData = false) =>
  axios.get(`${API_URL}/api/mmltulosteet/rasitustodistus/${withPersonalData ? 'henkilotiedoilla' : 'ilmanhenkilotietoja'}/${ktunnus}`, {
    responseType: 'blob',
    withCredentials: true,
  });

export const getLainhuutotodistus = (ktunnus, withPersonalData = false) =>
  axios.get(`${API_URL}/api/mmltulosteet/lainhuutotodistus/${withPersonalData ? 'henkilotiedoilla' : 'ilmanhenkilotietoja'}/${ktunnus}`, {
    responseType: 'blob',
    withCredentials: true,
  });

export const getVuokraoikeustodistus = (ktunnus, withPersonalData = false) =>
  axios.get(`${API_URL}/api/mmltulosteet/vuokraoikeustodistus/${withPersonalData ? 'henkilotiedoilla' : 'ilmanhenkilotietoja'}/${ktunnus}`, {
    responseType: 'blob',
    withCredentials: true,
  });