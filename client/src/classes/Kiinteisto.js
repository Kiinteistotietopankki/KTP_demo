import Rakennus from "./Rakennus";
import axios from "axios";

export default class Kiinteisto {
  constructor(tunnus) {
    this.kiinteistotunnus = tunnus;
    this.urlKiinteistohaku = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:4326&CQL_FILTER=property_identifier=';
    this.rakennukset = [];
  }

  async init() {
    const data = await this.fetchRakennukset();
    if (Array.isArray(data?.features)) {
      this.rakennukset = await this.createRakennukset(data.features);
    }
  }

  async fetchRakennukset(tunnus) {
    try {
      const response = await axios.get(`${this.urlKiinteistohaku}${tunnus}`);
      return response.data;
    } catch (error) {
      console.error("Virhe rakennusten haussa:", error);
      return null;
    }
  }

  async createRakennukset(features) {
    const rakennukset = features.map(feature => new Rakennus(feature));
  
    // Wait for each rakennus to initialize (fetch address data)
    await Promise.all(rakennukset.map(rakennus => rakennus.init()));
  
    return rakennukset;
  }

  getRakennukset() {
    return this.rakennukset;
  }

  toGeoJSON() {
    return {
      type: "FeatureCollection",
      features: this.rakennukset.map(rakennus => rakennus.toGeoJSON()),
      collectionId: this.kiinteistotunnus
    };
  }
}
