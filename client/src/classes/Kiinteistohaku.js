import Kiinteisto from "./Kiinteisto";
import Rakennus from "./Rakennus";

export default class KiinteistoHaku {

    constructor() {
        this.urlOsoitehaku = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&SRSNAME=EPSG:4326&CQL_FILTER=address_fin%20ILIKE%20'
        this.urlBuildingkeyRakennus = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:4326&featureID=open_building.'
        this.urlBuildingkeyOsoite =  'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&SRSNAME=EPSG:4326&CQL_FILTER=building_key='
        
        this.rawResults = []

    }


    async haeKiinteistotOsoitteella(osoite, kaupunki) {
        try {
            const osoiteRes = await fetch(`${this.urlOsoitehaku}'${osoite}%25'%20AND%20postal_office_fin='${kaupunki}'`);
            const osoiteData = await osoiteRes.json();

            const buildingKeys = [...new Set(osoiteData.features.map(f => f.properties.building_key))];

            const kiinteistotunnukset = await this.haeKiinteistotunnukset(buildingKeys);
            const kiinteistot = this.createKiinteistot(kiinteistotunnukset)
            
            

        } catch (err) {
            console.error("Virhe haussa:", err);
            return [];
        }
    }

    // 2. Hae kiinteistötunnukset building_key-arvojen perusteella
    async haeKiinteistotunnukset(buildingKeys) {
        const kiinteistotunnukset = new Set();

        for (const key of buildingKeys) {
            try {
                const res = await fetch(`${this.urlBuildingkeyRakennus}${key}`);
                const data = await res.json();

                const feature = data.features?.[0];
                const tunnus = feature?.properties?.property_identifier;

                if (tunnus) {
                    kiinteistotunnukset.add(tunnus);
                }
            } catch (err) {
                console.warn(`Virhe haettaessa rakennusta keyllä ${key}:`, err);
            }
        }

        return kiinteistotunnukset;
    }


    createKiinteistot(kiinteistotunnukset) {
        const kiinteistot = [];

        for (const kiinteistotunnus of kiinteistotunnukset) {
            const kiinteisto = new Kiinteisto(kiinteistotunnus);
            kiinteistot.push(kiinteisto);
        }

        return kiinteistot;
    }
  
  }
  


  