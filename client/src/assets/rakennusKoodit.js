const rakennusKoodit = {
    rakennusluokitus: {
        "01": "Vapaa-ajan asuinrakennus",
        "02": "Toimisto-, tuotanto-, yhdyskuntatekniikan tai muut rakennukset",
        "03": "Talousrakennus",
        "04": "Saunarakennus",
        "05": "Pientalo",
        "06": "Kerrostalo",
        "07": "Julkinen rakennus",
    },

    rakentamistapa: {
        "01": "Elementti",
        "02": "Paikalla tehty"
    },

    kayttotilanne: {
        "01": "Käytetään vakinaiseen asumiseen",
        "02": "Toimitila- tai tuotantokäytössä",
        "03": "Käytetään loma-asumiseen",
        "04": "Käytetään muuhun tilapäiseen asumiseen",
        "05": "Tyhjillään",
        "06": "Purettu uudisrakentamisen vuoksi",
        "07": "Purettu muusta syystä",
        "08": "Tuhoutunut",
        "09": "Ränsistymisen vuoksi hylätty",
        "10": "Käytöstä ei ole tietoa",
        "11": "Muu (sauna, liiteri, kellotapuli, yms.)"
    },

    julkisivumateriaali: {
        "00": "Ei tiedossa",
        "01": "Betoni",
        "02": "Tiili",
        "03": "Metallilevy",
        "04": "Kivi",
        "05": "Puu",
        "06": "Lasi",
        "99": "Muu"
    },

    lammitystapa: {
        "01": "Vesikeskuslämmitys",
        "02": "Ilmakeskuslämmitys",
        "03": "Sähkölämmitys",
        "04": "Uuni-takka-kamiinalämmitys",
        "05": "Aurinkolämmitys",
        "06": "Ilmalämpöpumppu",
        "07": "Ei kiinteää lämmityslaitetta",
        "99": "Muu"
    },

    lammitysenergialahde: {
        "01": "Kauko- tai aluelämpö",
        "02": "Kevyt polttoöljy",
        "03": "Raskas polttoöljy",
        "04": "Sähkö",
        "05": "Gaasu",
        "06": "Kivihiili",
        "07": "Puu",
        "08": "Turve",
        "09": "Maalämpö tms.",
        "10": "Aurinkoenergia",
        "11": "Lämpöpumppu",
        "99": "Muu"
    },

    rakennusaine: {
        "00": "Ei tiedossa",
        "01": "Betoni",
        "02": "Tiili",
        "03": "Teräs",
        "04": "Puu",
        "99": "Muu"
    }
};

export default rakennusKoodit;