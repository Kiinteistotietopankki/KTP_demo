export default class Kiinteisto {
    constructor(tunnus) {

        this.urlKiinteistohaku = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:4326&CQL_FILTER=property_identifier='
        this.kiinteistotunnus = tunnus;
        this.rakennukset = [];
    }

    addRakennus(rakennus) {
      this.rakennukset.push(rakennus);
    }

    async fetchRakennukset(tunnus){
      try {
        const res = await fetch(`${this.urlKiinteistohaku}${tunnus}`);


      } catch (error) {
        
      }  
    }

    createRakennukset(){

    }
  
    getRakennukset() {
      return this.rakennukset;
    }

  }
  


  