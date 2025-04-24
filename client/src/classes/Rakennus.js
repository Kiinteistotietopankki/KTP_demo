// Building.js
import axios from "axios";

export default class Rakennus {
    constructor(feature) { // Initial feature is always building data
        const p = feature.properties || {};
        const rawId = feature.id || null;

        this.id = rawId ? rawId.split(".").pop() : null; // Also known as buildingkey
    
        // Flatten geometry
        this.geometryType = feature.geometry?.type || null;
        this.coordinates = feature.geometry?.coordinates || [];
    
        // Flatten formerly nested properties into direct fields
        this.Rakennustunnus = p.permanent_building_identifier || null;
        this.Kiinteistotunnus = p.property_identifier || null; 
        this.KohteenNimi = null;
        this.KohteenOsoite = p.address_fin || null; // Osoite hausta
        this.Postinumero = p.postal_code || null; // Osoite hausta
        this.Toimipaikka = p.postal_office_fin || null; // Osoite hausta
    
        this.Rakennusvuosi = p.completion_date ? p.completion_date.split("-")[0] : null;
        this.Kokonaisala = p.total_area || null;
        this.Kerrosala = p.gross_floor_area || null;
        this.Huoneistoala = p.floor_area || null;
        this.Tilavuus = p.volume || null;
        this.Kerroksia = p.number_of_storeys || null;
    
        this.Rakennusluokitus = p.main_purpose || null;
        this.Runkotapa = p.construction_method || null;
        this.Kaytossaolotilanne = p.usage_status || null;
        this.JulkisivunRakennusaine = p.facade_material || null;
        this.Lammitystapa = p.heating_method || null;
        this.Lammitysenergianlahde = p.heating_energy_source || null;
        this.KantavanRakenteenRakennusaine = p.material_of_load_bearing_structures || null;
    
        // Placeholder fields
        this.Tulvariski = null;
        this.Pohjavesialueella = null;
        this.RadonArvo = null;
      }


      async init(haunOsoite){
        const data = await this.fetchAddressData(this.id, haunOsoite);
        const osoiteFeature = Array.isArray(data?.features) ? data.features[0] : null;
        this.setAddressData(osoiteFeature);
      }

      async fetchAddressData(buildingkey, haunOsoite){
        const url = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&SRSNAME=EPSG:4326&CQL_FILTER=building_key=';
        const addressConfirm = '%20AND%20address_fin%20ILIKE%20'
        try {
          const response = await axios.get(`${url}'${buildingkey}'${addressConfirm}'${haunOsoite}%25'`);
          return response.data;
        } catch (error) {
          console.error("Virhe rakennnuksen osoitetietojen haussa:", error);
          return null;
        }
      }

      async setAddressData(feature) {
        
        if (!feature || !feature.properties) return;
      
        const p = feature.properties;
      
        // Only fill address fields if they are missing
        this.KohteenOsoite ??= p.address_fin || null;
        this.Postinumero ??= p.postal_code || null;
        this.Toimipaikka ??= p.postal_office_fin || null;
      }
    
      /**
       * Return a plain object for JSON serialization
       */
      toJSON() {
        return {
          buildingkey: this.id,
          Rakennustunnus: this.Rakennustunnus,
          Kiinteistotunnus: this.Kiinteistotunnus,
          KohteenNimi: this.KohteenNimi,
          KohteenOsoite: this.KohteenOsoite,
          Postinumero: this.Postinumero,
          Toimipaikka: this.Toimipaikka,
          Rakennusvuosi: this.Rakennusvuosi,
          Kokonaisala: this.Kokonaisala,
          Kerrosala: this.Kerrosala,
          Huoneistoala: this.Huoneistoala,
          Tilavuus: this.Tilavuus,
          Kerroksia: this.Kerroksia,
          Rakennusluokitus: this.Rakennusluokitus,
          Runkotapa: this.Runkotapa,
          Kaytossaolotilanne: this.Kaytossaolotilanne,
          JulkisivunRakennusaine: this.JulkisivunRakennusaine,
          Lammitystapa: this.Lammitystapa,
          Lammitysenergianlahde: this.Lammitysenergianlahde,
          KantavanRakenteenRakennusaine: this.KantavanRakenteenRakennusaine,
          Tulvariski: this.Tulvariski,
          Pohjavesialueella: this.Pohjavesialueella,
          RadonArvo: this.RadonArvo
        };
      }

      toGeoJSON() {
        return {
            type: "Rakennus",
            geometry: {
                type: this.geometryType, 
                coordinates: this.coordinates 
            },
            id_buildingkey:this.id,
            id_rakennustunnus:this.Rakennustunnus,
            properties: this.toJSON() 
        };
    }
  }