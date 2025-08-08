// src/api/mmlApi.js
import axios from "axios";
import config from "../devprodConfig";

const API_URL = config.apiBaseUrl;
const BASE_URL = "/api/mml";

const api = axios.create({
  baseURL: API_URL + BASE_URL,
  withCredentials: true
});

// 🧩 Generic GET helper
const get = (path, kohdetunnus) => api.get(`${path}/${encodeURIComponent(kohdetunnus)}`);

// --- Perustiedot ---
export const getPerustiedot = (kohdetunnus) => get("/perustiedot", kohdetunnus);
export const getRekisteriyksikko = (kohdetunnus) => get("/rekisteriyksikko", kohdetunnus);
export const getMaaraAla = (kohdetunnus) => get("/maara_ala", kohdetunnus);
export const getLaitos = (kohdetunnus) => get("/laitos", kohdetunnus);
export const getYhteystieto = (kohdetunnus) => get("/yhteystieto", kohdetunnus);

// --- Lainhuutotiedot ---
export const getLainhuutotiedotIlmanHenkilotietoja = (kohdetunnus) =>
  get("/lainhuutotiedot/ilmanhenkilotietoja", kohdetunnus);

export const getLainhuutotiedotIlmanHenkilotunnuksia = (kohdetunnus) =>
  get("/lainhuutotiedot/ilmanhenkilotunnuksia", kohdetunnus);

export const getLainhuutotiedotHenkilotunnuksilla = (kohdetunnus) =>
  get("/lainhuutotiedot/henkilotunnuksilla", kohdetunnus);

// --- Rasitustiedot ---
export const getRasitustiedotIlmanHenkilotietoja = (kohdetunnus) =>
  get("/rasitustiedot/ilmanhenkilotietoja", kohdetunnus);

export const getRasitustiedotIlmanHenkilotunnuksia = (kohdetunnus) =>
  get("/rasitustiedot/ilmanhenkilotunnuksia", kohdetunnus);

export const getRasitustiedotHenkilotunnuksilla = (kohdetunnus) =>
  get("/rasitustiedot/henkilotunnuksilla", kohdetunnus);

// --- Vuokraoikeustiedot ---
export const getVuokraoikeustiedotIlmanHenkilotietoja = (kohdetunnus) =>
  get("/vuokraoikeustiedot/ilmanhenkilotietoja", kohdetunnus);

export const getVuokraoikeustiedotIlmanHenkilotunnuksia = (kohdetunnus) =>
  get("/vuokraoikeustiedot/ilmanhenkilotunnuksia", kohdetunnus);

export const getVuokraoikeustiedotHenkilotunnuksilla = (kohdetunnus) =>
  get("/vuokraoikeustiedot/henkilotunnuksilla", kohdetunnus);