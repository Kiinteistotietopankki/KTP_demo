// Building.js
import axios from "axios";
import rakennusKoodit from "../assets/rakennusKoodit";

export default class Rakennus {
    constructor(feature, addreskey='') { // Initial feature is always building data
        const p = feature.properties || {};
        const rawId = feature.id || null;

        this.id = rawId ? rawId.split(".").pop() : null; // Also known as buildingkey
    
        // Flatten geometry
        this.geometryType = feature.geometry?.type || null;
        this.coordinates = feature.geometry?.coordinates || [];

        this.Addresskey = addreskey || null // Original addresskey
    
        // Flatten formerly nested properties into direct fields
        this.Rakennustunnus = p.permanent_building_identifier || null;
        this.Kiinteistotunnus = p.property_identifier || null; 
        this.KohteenNimi = null;
        this.KohteenOsoite = p.address_fin || []; // Osoite hausta
        this.Postinumero = p.postal_code || null; // Osoite hausta
        this.Toimipaikka = p.postal_office_fin || null; // Osoite hausta

    
        this.Rakennusvuosi = p.completion_date ? p.completion_date.split("-")[0] : null;
        this.Kokonaisala = p.total_area || null;
        this.Kerrosala = p.gross_floor_area || null;
        this.Huoneistoala = p.floor_area || null;
        this.Tilavuus = p.volume || null;
        this.Kerroksia = p.number_of_storeys || null;
    
        const getCode = uri => uri?.split("/").pop() || null;
        this.Rakennusluokitus = rakennusKoodit.rakennusluokitus[getCode(p.main_purpose)] || null;
        this.Runkotapa = rakennusKoodit.rakentamistapa[getCode(p.construction_method)] || null;
        this.Kaytossaolotilanne = rakennusKoodit.kayttotilanne[getCode(p.usage_status)] || null;
        this.JulkisivunRakennusaine = rakennusKoodit.julkisivumateriaali[getCode(p.facade_material)] || null;
        this.Lammitystapa = rakennusKoodit.lammitystapa[getCode(p.heating_method)] || null;
        this.Lammitysenergianlahde = rakennusKoodit.lammitysenergialahde[getCode(p.heating_energy_source)] || null;
        this.KantavanRakenteenRakennusaine = rakennusKoodit.rakennusaine[getCode(p.material_of_load_bearing_structures)] || null;
    
        // Placeholder fields
        this.Tulvariski = null;
        this.Pohjavesialueella = null;
        this.RadonArvo = null;
      }


      async init(haunOsoite=''){
        const data = await this.fetchAddressData(this.id, haunOsoite);
        const osoiteFeature = data?.features;
        this.setAddressData(osoiteFeature);
      }

      async fetchAddressData(buildingkey, haunOsoite=''){
        const url = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&SRSNAME=EPSG:4326&CQL_FILTER=building_key=';
        const addressConfirm = '%20AND%20address_fin%20ILIKE%20'
        const addressNumberConfirm = `%20AND%20address_number='1'`
        const addressKeyConfirm = `%20AND%20address_key='${this.Addresskey}'`

        try {
          let response
          if (haunOsoite.length > 0){
            // response = await axios.get(`${url}'${buildingkey}'${addressKeyConfirm}`);
            response = await axios.get(`${url}'${buildingkey}'${addressConfirm}'${haunOsoite}%25'`);
            // if (response.data?.features?.length < 1){
            //   response = await axios.get(`${url}'${buildingkey}'${addressNumberConfirm}`);

            // }
          } else{
            // response = await axios.get(`${url}'${buildingkey}'${addressNumberConfirm}`);
            response = await axios.get(`${url}'${buildingkey}'`);
          }
          return response.data;
        } catch (error) {
          console.error("Virhe rakennuksen osoitetietojen haussa:", error);
          return null;
        }
      }

      async setAddressData(features) {
        
        if (!features) return;
      
        for (const feature of features){
          if (!feature || !feature.properties) continue;

          const p = feature.properties;
      
          this.KohteenOsoite.push(p.address_fin);
          this.Postinumero ??= p.postal_code || null;
          this.Toimipaikka ??= p.postal_office_fin || null
        }
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
          RadonArvo: this.RadonArvo,
        };
      }

      toCategoriesJSON() {
        const sourceYmparistofi = "Ympäristö.fi";



        return {
          yleistiedot: {
            "Rakennustunnus": { value: this.Rakennustunnus, source: sourceYmparistofi },
            "Kiinteistötunnus": { value: this.Kiinteistotunnus, source: sourceYmparistofi },
            "Kohteen nimi": { value: null, source: null },
            "Kohteen osoitteet": { value: this.KohteenOsoite, source: sourceYmparistofi },
            "Postinumero": { value: this.Postinumero, source: sourceYmparistofi },
            "Toimipaikka": { value: this.Toimipaikka, source: sourceYmparistofi },
          },
          teknisettiedot: {
            "Rakennusvuosi": { value: this.Rakennusvuosi,  source: sourceYmparistofi  },
            "Kokonaisala (m²)": { value: this.Kokonaisala,  source: sourceYmparistofi },
            "Kerrosala (m²)": { value: this.Kerrosala,  source: sourceYmparistofi },
            "Huoneistoala (m²)": { value: this.Huoneistoala,  source: sourceYmparistofi  },
            "Tilavuus (m³)": { value: this.Tilavuus,  source: sourceYmparistofi },
            "Kerroksia": { value: this.Kerroksia, source: sourceYmparistofi  },
          },
          rakennustiedot: {
            "Rakennusluokitus": { value: this.Rakennusluokitus,  source: sourceYmparistofi  },
            "Runkotapa": { value: this.Runkotapa,  source: sourceYmparistofi  },
            "Käytössäolotilanne": { value: this.Kaytossaolotilanne,  source: sourceYmparistofi },
            "Julkisivun rakennusaine": { value: this.JulkisivunRakennusaine, source: sourceYmparistofi },
            "Lämmitystapa": { value: this.Lammitystapa, source: sourceYmparistofi },
            "Lämmitysenergianlähde": { value: this.Lammitysenergianlahde, source: sourceYmparistofi  },
            "Kantavanrakenteen rakennusaine": { value: this.KantavanRakenteenRakennusaine, source: sourceYmparistofi },
          },
          aluetiedot: {
            "Tulvariski": { value: null, source: sourceYmparistofi },
            "Pohjavesialueella": { value: null, source: sourceYmparistofi },
            "radon arvo": { value: null, source: sourceYmparistofi}
          }      
        }
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
            properties: this.toCategoriesJSON(),
        };
    }
  }