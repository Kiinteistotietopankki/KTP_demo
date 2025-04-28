import { ktEsitysmuotoon } from "../assets/ktMuuntaja";
import Rakennus from "./Rakennus";
import axios from "axios";

export default class Kiinteisto {
  constructor(tunnus, addresskey='') {
    this.kiinteistotunnus = tunnus;
    this.addressKey = addresskey || null
    this.urlKiinteistohaku = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:4326&CQL_FILTER=property_identifier=';
    this.rakennukset = [];
  }

  async init(haunOsoite='') {
    // const data = await this.fetchRakennukset(this.kiinteistotunnus);
    // if (Array.isArray(data?.features)) {
    //   this.rakennukset = await this.createRakennukset(data.features, this.addressKey,haunOsoite);
    // }
    const data = await this.fetchRakennukset(this.kiinteistotunnus);
    if (Array.isArray(data?.features)) {
      let rakennukset = await this.createRakennukset(data.features, this.addressKey, haunOsoite);

      console.log('Rakennusten tyyppi', rakennukset)
  
      // Filter rakennukset: keep only those that include haunOsoite
      if (haunOsoite.length > 0) {
        const regex = new RegExp(`^${haunOsoite}`, 'i');  // 'i' for case-insensitive match
        rakennukset = rakennukset.filter(rakennus => {
          return regex.test(rakennus?.KohteenOsoite); 
        });
      }
  
      this.rakennukset = rakennukset;
    }


  }

  async fetchRakennukset(tunnus) {
    try {
      const response = await axios.get(`${this.urlKiinteistohaku}'${tunnus}'`);
      return response.data;
    } catch (error) {
      console.error("Virhe rakennusten haussa:", error);
      return null;
    }
  }

  async createRakennukset(features,addresskey='',haunOsoite='') {
    const rakennukset = features.map(feature => new Rakennus(feature, addresskey));
  
    // Wait for each rakennus to initialize (fetch address data)
    await Promise.all(rakennukset.map(rakennus => rakennus.init(haunOsoite)));
  
    return rakennukset;
  }

  getRakennukset() {
    return this.rakennukset;
  }

  toGeoJSON() {
    return {
      type: "Kiinteisto",
      rakennukset: this.rakennukset.map(rakennus => rakennus.toGeoJSON()),
      id_kiinteistotunnus: this.kiinteistotunnus,
      id_esitysmuoto_kiinteistotunnus: ktEsitysmuotoon(this.kiinteistotunnus)
    };
  }
}
