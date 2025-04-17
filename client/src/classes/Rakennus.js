// Building.js
export default class Rakennus {
    constructor(feature) {
        const p = feature.properties || {};
        this.id = p.building_key || feature.id || null; // Osoite hausta ja rakennushausta
    
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
    
      /**
       * Return a plain object for JSON serialization
       */
      toJSON() {
        return {
          id: this.id,
          geometryType: this.geometryType,
          coordinates: this.coordinates,
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
  }