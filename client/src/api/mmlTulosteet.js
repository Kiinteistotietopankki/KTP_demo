import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;



export const getRasitustodistus = (ktunnus, withPersonalData = true) =>
  axios.get(`${API_URL}/api/mmltulosteet/rasitustodistus/${withPersonalData ? 'henkilotiedoilla' : 'ilmanhenkilotietoja'}/${ktunnus}`, {
    responseType: 'blob',
    withCredentials: true,
  });

export const getLainhuutotodistus = (ktunnus, withPersonalData = true) =>
  axios.get(`${API_URL}/api/mmltulosteet/lainhuutotodistus/${withPersonalData ? 'henkilotiedoilla' : 'ilmanhenkilotietoja'}/${ktunnus}`, {
    responseType: 'blob',
    withCredentials: true,
  });

export const getVuokraoikeustodistus = (ktunnus, withPersonalData = true) =>
  axios.get(`${API_URL}/api/mmltulosteet/vuokraoikeustodistus/${withPersonalData ? 'henkilotiedoilla' : 'ilmanhenkilotietoja'}/${ktunnus}`, {
    responseType: 'blob',
    withCredentials: true,
  });