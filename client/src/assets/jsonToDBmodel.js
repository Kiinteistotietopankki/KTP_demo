
export function jsonToModelFormat(data) {
  const kiinteistotunnus = data.id_esitysmuoto_kiinteistotunnus || "";
  const rakennukset = data.rakennukset || [];

  const rakennusdata = rakennukset.map(r => {
    const props = r.properties || {};
    const yleistiedot = props.yleistiedot || {};
    const teknisettiedot = props.teknisettiedot || {};
    const rakennustiedot = props.rakennustiedot || {};

    function safeString(val) {
    return val != null && val !== "null" ? String(val) : null;
    }

    return {
      rakennustunnus: (yleistiedot.Rakennustunnus && yleistiedot.Rakennustunnus.value) || null,
      osoite: (yleistiedot["Kohteen osoitteet"] && yleistiedot["Kohteen osoitteet"].value && yleistiedot["Kohteen osoitteet"].value[0]) || null,
      toimipaikka: (yleistiedot.Toimipaikka && yleistiedot.Toimipaikka.value) || null,
      postinumero: (yleistiedot.Postinumero && yleistiedot.Postinumero.value) || null,

        rakennustiedotArray: [{
            rakennusvuosi: teknisettiedot.Rakennusvuosi?.value || "",
            kokonaisala: safeString(teknisettiedot["Kokonaisala (m²)"]?.value),
            kerrosala: safeString(teknisettiedot["Kerrosala (m²)"]?.value),
            huoneistoala: safeString(teknisettiedot["Huoneistoala (m²)"]?.value),
            tilaavuus: safeString(teknisettiedot["Tilavuus (m³)"]?.value),
            kerroksia: safeString(teknisettiedot.Kerroksia?.value),
            sijainti: r.geometry?.coordinates
                ? { type: "Point", coordinates: r.geometry.coordinates }
                : null,

      }],

      rakennusluokituksetArray: [{
        rakennusluokitus: (rakennustiedot.Rakennusluokitus && rakennustiedot.Rakennusluokitus.value) || "",
        runkotapa: (rakennustiedot.Runkotapa && rakennustiedot.Runkotapa.value) || "",
        kayttotilanne: (rakennustiedot.Käytössäolotilanne && rakennustiedot.Käytössäolotilanne.value) || "",
        julkisivumateriaali: (rakennustiedot["Julkisivun rakennusaine"] && rakennustiedot["Julkisivun rakennusaine"].value) || "",
        lammitystapa: (rakennustiedot.Lämmitystapa && rakennustiedot.Lämmitystapa.value) || "",
        lammitysenergialahde: (rakennustiedot.Lämmitysenergianlähde && rakennustiedot.Lämmitysenergianlähde.value) || "",
        rakennusaine: (rakennustiedot["Kantavanrakenteen rakennusaine"] && rakennustiedot["Kantavanrakenteen rakennusaine"].value) || "",
      }],
    };
  });

  return {
    kiinteistodata: {
      kiinteistotunnus: kiinteistotunnus
    },
    rakennusdata: rakennusdata
  };
}
