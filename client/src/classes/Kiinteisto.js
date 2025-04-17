export default class Kiinteisto {
    constructor(tunnus) {

        this.kiinteistotunnus = tunnus;
        this.rakennukset = [];
    }

    addRakennus(rakennus) {
      this.buildings.push(rakennus);
    }

    fetchRakennukset(kiinteistotunnus){
        
    }
  
    getRakennukset() {
      return this.buildings;
    }

  }
  


  