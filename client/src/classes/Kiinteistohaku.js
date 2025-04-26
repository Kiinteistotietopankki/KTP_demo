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
    this.addressConfirm = '%20AND%20address_fin%20ILIKE%20'
    }


  async haeKiinteistoja({kiinteistotunnus='', osoite='', kaupunki=''}){
    try {
      if(osoite.length > 0 && kiinteistotunnus.length > 0){

      }
      else if (osoite.length > 0){
        const osoiteData = await this.fetchOsoiteData(osoite, kaupunki);
        const buildingKeys = this.extractBuildingKeys(osoiteData);
        const addressKeys = this.extractAddressKeys(osoiteData)
        
        const kiinteistotunnukset = await this.haeKiinteistotunnukset(buildingKeys);
        return await this.createKiinteistot(kiinteistotunnukset, addressKeys, osoite);
      }
      else if (kiinteistotunnus.length > 0){
        return await this.createKiinteistotWithoutAddress(kiinteistotunnus);
      }

    } catch (error) {
      console.error("Virhe haussa:", error);
      return [];
    }
  }

  // Helper method to fetch osoite data
  async fetchOsoiteData(osoite, kaupunki='') {
    let url
    if (kaupunki.length > 0){
      url = `${this.urlOsoitehaku}'${osoite}%25'${this.urlOsoitehakuKunta}'${kaupunki}'`
    }else{
      url = `${this.urlOsoitehaku}'${osoite}%25'`
    }
    
    const response = await this.http.get(url);

    return response.data;
  }

  // Helper method to extract building keys from data
  extractBuildingKeys(osoiteData) {
    return [...new Set(osoiteData.features.map(f => f.properties.building_key))];
  }

  extractAddressKeys(osoiteData) {
    return [...new Set(osoiteData.features.map(f => f.properties.address_key))];
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
  async createKiinteistot(kiinteistotunnukset, addresskeys='',osoite = '') {
    // Normalize input: ensure it's always an array
    const kiinteistotunnusArray = typeof kiinteistotunnukset === 'string' ? [kiinteistotunnukset] : Array.from(kiinteistotunnukset);
    
    const akList = Array.from(addresskeys)

    const tunnuksetWithAdressKeys =  kiinteistotunnusArray.map((val, index) => [val, akList[index]]);


    const kiinteistot = tunnuksetWithAdressKeys.map(([buildingKey, addressKey]) =>
      new Kiinteisto(buildingKey, addressKey)
    );
  
    // Call init on each
    await Promise.all(kiinteistot.map(k => k.init(osoite)));
  
    return kiinteistot;
  }

  async createKiinteistotWithoutAddress(kiinteistotunnukset) {
    // Normalize input: ensure it's always an array
    const kiinteistotunnusArray = typeof kiinteistotunnukset === 'string' ? [kiinteistotunnukset] : Array.from(kiinteistotunnukset);
  

    const kiinteistot = kiinteistotunnusArray.map(tunnus => new Kiinteisto(tunnus)); // Vanha, ilman addresskeyta

    // const kiinteistot = tunnuksetWithAdressKeys.map(([buildingKey, addressKey]) =>
    //   new Kiinteisto(buildingKey, addressKey)
    // );
  
    // Call init on each
    await Promise.all(kiinteistot.map(k => k.init()));
  
    return kiinteistot;
  }
}
