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
        this.KohteenOsoite = p.address_fin || null; // Osoite hausta
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
        const osoiteFeature = Array.isArray(data?.features) ? data.features[0] : null;
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
            if (response.data?.features?.length < 1){
              response = await axios.get(`${url}'${buildingkey}'${addressNumberConfirm}`);

            }
          } else{
            response = await axios.get(`${url}'${buildingkey}'${addressNumberConfirm}`);
          }
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
          RadonArvo: this.RadonArvo,
        };
      }

      getSources(){
        const sourceNameRyhtiYmparistofi = "Ymparisto.fi RYHTI";
        const sourceNameYmparistofi = "Ymparisto.fi";

        return {
          Rakennustunnus: sourceNameRyhtiYmparistofi,
          Kiinteistotunnus: sourceNameRyhtiYmparistofi,
          KohteenNimi: sourceNameRyhtiYmparistofi,
          KohteenOsoite: sourceNameRyhtiYmparistofi,
          Postinumero: sourceNameRyhtiYmparistofi,
          Toimipaikka: sourceNameRyhtiYmparistofi,
          Rakennusvuosi: sourceNameRyhtiYmparistofi,
          Kokonaisala: sourceNameRyhtiYmparistofi,
          Kerrosala: sourceNameRyhtiYmparistofi,
          Huoneistoala: sourceNameRyhtiYmparistofi,
          Tilavuus: sourceNameRyhtiYmparistofi,
          Kerroksia: sourceNameRyhtiYmparistofi,
          Rakennusluokitus: sourceNameRyhtiYmparistofi,
          Runkotapa: sourceNameRyhtiYmparistofi,
          Kaytossaolotilanne: sourceNameRyhtiYmparistofi,
          JulkisivunRakennusaine: sourceNameRyhtiYmparistofi,
          Lammitystapa: sourceNameRyhtiYmparistofi,
          Lammitysenergianlahde: sourceNameRyhtiYmparistofi,
          KantavanRakenteenRakennusaine: sourceNameRyhtiYmparistofi,
          Tulvariski: sourceNameYmparistofi,
          Pohjavesialueella: sourceNameYmparistofi,
          RadonArvo: sourceNameRyhtiYmparistofi
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
            properties: this.toJSON(),
            sources: this.getSources()
        };
    }
  }