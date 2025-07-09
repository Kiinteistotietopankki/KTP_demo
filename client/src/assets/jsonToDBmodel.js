
export function jsonToModelFormat(data) {
  const kiinteistotunnus = data.id_esitysmuoto_kiinteistotunnus || "";
  const rakennukset = data.rakennukset || [];

  function safeString(val) {
    return val != null && val !== "null" ? String(val) : null;
  }

  const rakennusdata = rakennukset.map((r, index) => {
    const props = r.properties || {};
    const yleistiedot = props.yleistiedot || {};
    const teknisettiedot = props.teknisettiedot || {};
    const rakennustiedot = props.rakennustiedot || {};

    return {
      // id_kiinteisto is auto-generated in DB, so it's omitted
      rakennustunnus: yleistiedot.Rakennustunnus?.value || null,
      osoite: yleistiedot["Kohteen osoitteet"]?.value?.[0] || null,
      toimipaikka: yleistiedot.Toimipaikka?.value || null,
      postinumero: yleistiedot.Postinumero?.value || null,

      rakennusvuosi: teknisettiedot.Rakennusvuosi?.value || null,
      kokonaisala: safeString(teknisettiedot["Kokonaisala (m²)"]?.value),
      kerrosala: safeString(teknisettiedot["Kerrosala (m²)"]?.value),
      huoneistoala: safeString(teknisettiedot["Huoneistoala (m²)"]?.value),
      tilavuus: safeString(teknisettiedot["Tilavuus (m³)"]?.value),
      kerroksia: safeString(teknisettiedot.Kerroksia?.value),
      sijainti: r.geometry?.coordinates
        ? { type: "Point", coordinates: r.geometry.coordinates }
        : null,

      rakennusluokitus: rakennustiedot.Rakennusluokitus?.value || null,
      runkotapa: rakennustiedot.Runkotapa?.value || null,
      kayttotilanne: rakennustiedot.Käytössäolotilanne?.value || null,
      julkisivumateriaali: rakennustiedot["Julkisivun rakennusaine"]?.value || null,
      lammitystapa: rakennustiedot.Lämmitystapa?.value || null,
      lammitysenergialahde: rakennustiedot.Lämmitysenergianlähde?.value || null,
      rakennusaine: rakennustiedot["Kantavanrakenteen rakennusaine"]?.value || null,
    };
  });

  return {
    kiinteistotunnus: kiinteistotunnus,
    rakennukset_fulls: rakennusdata
  };
}