
export function jsonToModelFormat(data){
  const kiinteistotunnus = data.id_esitysmuoto_kiinteistotunnus || "";
  const rakennukset = data.rakennukset || [];

  const rakennusdata = rakennukset.map(r => {
    const props = r.properties || {};
    const yleistiedot = props.yleistiedot || {};
    const teknisettiedot = props.teknisettiedot || {};
    const rakennustiedot = props.rakennustiedot || {};

    return {
      rakennustunnus: (yleistiedot.Rakennustunnus && yleistiedot.Rakennustunnus.value) || "",
      osoite: (yleistiedot["Kohteen osoitteet"] && yleistiedot["Kohteen osoitteet"].value && yleistiedot["Kohteen osoitteet"].value[0]) || "",
      toimipaikka: (yleistiedot.Toimipaikka && yleistiedot.Toimipaikka.value) || "",
      postinumero: (yleistiedot.Postinumero && yleistiedot.Postinumero.value) || "",
      rakennustiedotArray: [{
        rakennusvuosi: (teknisettiedot.Rakennusvuosi && teknisettiedot.Rakennusvuosi.value) || "",
        kokonaisala: teknisettiedot["Kokonaisala (m²)"] ? String(teknisettiedot["Kokonaisala (m²)"].value) : ""
      }],
      rakennusluokituksetArray: [{
        rakennusluokitus: (rakennustiedot.Rakennusluokitus && rakennustiedot.Rakennusluokitus.value) || "",
        runkotapa: (rakennustiedot.Runkotapa && rakennustiedot.Runkotapa.value) || ""
      }]
    };
  });

  return {
    kiinteistodata: {
      kiinteistotunnus: kiinteistotunnus
    },
    rakennusdata: rakennusdata
  };
}