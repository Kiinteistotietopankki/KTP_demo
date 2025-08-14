import Allekirjoitus from '../../Static/Allekirjoitus';
import JohdantoText from '../../Static/johdando';
import Jarjestelmakuvaus from '../../Static/Jarjestelmariskikuvaus';

export const reportTemplates = Object.freeze({
  wpts: {
    name: 'W-PTS KATSELMUS',
    defaultSections: [
      { key: 'johdanto',       label: ' Johdanto', content: JohdantoText.Option1,       include: true,  images: [] },
      { key: 'jarjestelma',    label: ' Järjestelmäkuvaukset ja Riskiluokitus', content: Jarjestelmakuvaus.option1, include: true,  images: [] },
      { key: 'rakennetekniikka', label: 'Rakennetekniikkan Kuvat',content: '',include: true,  images: [] },
      { key: 'lvi',            label: 'LVI-Tekniikan Kuvat',content: '', include: true,  images: [] },
      { key: 'sahko',          label: ' Sähköjärjestelmien Kuvat', content: '',                          include: true,  images: [] },
      { key: 'lähtötiedot',    label: 'Lähtötiedot', content: '', include: true,  images: [] },
      { key: 'havainnot',      label: 'Merkittävimmät havainnot', content: '', include: true,  images: [] },
      { key: 'allekirjoitus',  label: 'Allekirjoitukset',   content: Allekirjoitus.Option1, include: false, images: [] },
    ],
  },

  wk1: {
    name: 'KUNTOARVIO WK1',
    defaultSections: [
      { key: 'johdanto',     label: 'Yleiskuvaus',           content: '', include: true, images: [] },
      { key: 'kuntoarvio',   label: 'Kuntoarviointi',        content: '', include: true, images: [] },
      { key: 'riskit',       label: 'Riskit ja Huomiot',     content: '', include: true, images: [] },
      { key: 'toimenpide',   label: 'Suositellut Toimenpiteet', content: '', include: true, images: [] },
      { key: 'allekirjoitus',label: 'Allekirjoitukset',      content: Allekirjoitus.Option1, include: true, images: [] },
    ],
  },

  Markatila: {
    name: 'MÄRKÄTILA WK1',
    defaultSections: [
      { key: 'johdanto',     label: 'Yleiskuvaus',           content: '', include: true, images: [] },
      { key: 'kuntoarvio',   label: 'Kuntoarviointi',        content: '', include: true, images: [] },
      { key: 'riskit',       label: 'Riskit ja Huomiot',     content: '', include: true, images: [] },
      { key: 'toimenpide',   label: 'Suositellut Toimenpiteet', content: '', include: true, images: [] },
      { key: 'allekirjoitus',label: 'Allekirjoitukset',      content: Allekirjoitus.Option1, include: true, images: [] },
    ],
  },

  wk3: {
    name: 'KUNTOARVIO WK3',
    defaultSections: [
      { key: 'johdanto',     label: 'Johdanto ',content: JohdantoText.Option1, include: true, images: [] },
      { key: 'jarjestelma',   label: 'Järjestelmäkuvaukset ja Riskiluokitus', content: Jarjestelmakuvaus.option1, include: true, images: [] },
      { key: 'yhteenveto',       label: 'Yhteenveto',     content: '', include: true, images: [] },
      { key: 'toimenpide',   label: 'PTS-ehdotukset', content: '', include: true, images: [], children: []},
      { key: 'lahtotiedot',label: 'Lähtötiedot',      content: '', include: true, images: [],children: [] },
      { key: 'havainnot',label: 'Havainnot nykytilanteesta',      content: '', include: true, images: [],children: [] },
      { key: 'turvallisuus',label: 'Turvallisuus - ja ympäristöriskit',      content: '', include: true, images: [] },
      { key: 'energia',label: 'Energiataloudellinen selvitys',      content: '', include: true, images: [] },
      { key: 'rakennekunto',label: 'Rakennetekninen kuntoarvio',      content: '', include: true, images: [] },
      { key: 'lvikunto',label: 'LVI-järjestelmien kuntoarvio',      content: '', include: true, images: [] },
      { key: 'sähkökunto',label: 'Sähköjärjestelmien kuntoarvio',      content: '', include: true, images: [] },
      { key: 'allekirjoitus',label: 'Allekirjoitukset',      content: Allekirjoitus.Option1, include: true, images: [] },
    ],
  },
});

export default reportTemplates;
