import Kiinteisto from "./Kiinteisto";
import axios from "axios";

export default class KiinteistoHaku {
  constructor(httpClient = axios) {

    this.http = httpClient;
    
    this.urlOsoitehaku =
      'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&SRSNAME=EPSG:4326&CQL_FILTER=address_fin%20ILIKE%20';
    this.urlOsoitehakuKunta = '%20AND%20postal_office_fin%20ILIKE%20'
    this.urlBuildingkeyRakennus =
      'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:4326&featureID=open_building.';
    this.urlBuildingkeyOsoite =
      'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&SRSNAME=EPSG:4326&CQL_FILTER=building_key=';
  }

  // Public method to start the process
  async haeKiinteistotOsoitteella(osoite, kaupunki) {
    try {
      const osoiteData = await this.fetchOsoiteData(osoite, kaupunki);
      console.log('HaeKiinteistotOsoitteella - osoitedata', osoiteData)
      const buildingKeys = this.extractBuildingKeys(osoiteData);
      const kiinteistotunnukset = await this.haeKiinteistotunnukset(buildingKeys);
      return await this.createKiinteistot(kiinteistotunnukset);
    } catch (err) {
      console.error("Virhe haussa:", err);
      return [];
    }
  }

  // Helper method to fetch osoite data
  async fetchOsoiteData(osoite, kaupunki) {
    let url = `${this.urlOsoitehaku}'${osoite}%25'${this.urlOsoitehakuKunta}'${kaupunki}'`
    const response = await this.http.get(url);

    console.log('fetchOsoiteData', response.data)
    console.log('fetchOsoiteData 2', url)
    return response.data;
  }

  // Helper method to extract building keys from data
  extractBuildingKeys(osoiteData) {
    return [...new Set(osoiteData.features.map(f => f.properties.building_key))];
  }

  // Fetch kiinteistotunnukset based on building keys
  async haeKiinteistotunnukset(buildingKeys) {
    const kiinteistotunnukset = new Set();
    for (const key of buildingKeys) {
      try {
        const data = await this.fetchBuildingKeyData(key);
        const tunnus = this.extractTunnus(data);
        if (tunnus) kiinteistotunnukset.add(tunnus);
      } catch (err) {
        console.warn(`Virhe haettaessa rakennusta keyllä ${key}:`, err);
      }
    }
    return kiinteistotunnukset;
  }

  // Helper method to fetch building key data
  async fetchBuildingKeyData(key) {
    const res = await this.http.get(`${this.urlBuildingkeyRakennus}${key}`);
    return res.data;
  }

  // Extract tunnus from building key data
  extractTunnus(data) {
    const feature = data.features?.[0];
    return feature?.properties?.property_identifier;
  }

  // Create kiinteistot based on kiinteistotunnukset
  async createKiinteistot(kiinteistotunnukset) {
    const list = Array.from(kiinteistotunnukset); // convert Set to Array
    const kiinteistot = list.map(tunnus => new Kiinteisto(tunnus));
  
    // Call init (or kiinteistoMain) on each
    await Promise.all(kiinteistot.map(k => k.init()));
  
    return kiinteistot;
  }
}
