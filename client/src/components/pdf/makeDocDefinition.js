import formatFinnishDate from '../utils/formatFinnishDate';

export default function makeDocDefinition({
  title,
  propertyName,
  dateIso,
  coverImage,
  logoBase64,
  sections,
  riskidata,
  rakennusData,
  ptsImages
}) {
  const content = [];

  // const CONTENT_WIDTH = 515;

  const PAGE_WIDTH = 595.28; // A4 in points at 72dpi
  const MARGIN_LEFT = 30;
  const MARGIN_RIGHT = 30;

  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  
  let sectionCounter = 0;
  let currentSub = 0;

  const pushNumberedSection = (arr, { title, pageBreak = 'before', tocItem = true, id }) => {
    sectionCounter += 1;
    currentSub = 0; 
    arr.push({
      stack: [
        { text: `${sectionCounter} ${title.toUpperCase()}`, style: 'sectionHeading', pageBreak, tocItem, id },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH, y2: 0, lineWidth: 1.5, lineColor: '#000' }] },
      ],
      margin: [0, 10, 0, 18],
    });
  };

  const pushSubsection = (arr, { title, tocItem = true, id }) => {
    currentSub += 1;
    arr.push({
      text: `${sectionCounter}.${currentSub} ${title.toUpperCase()}`,
      style: 'subHeading',
      margin: [0, 12, 0, 6],
      tocItem,
      id,
    });
  };
// Turn a big blob of text into nicely spaced paragraphs
function pushCleanParagraphs(arr, rawText) {
  if (!rawText) return;
  const parts = String(rawText)
    .replace(/\r\n/g, '\n')          // normalize newlines
    .replace(/[ \t]+\n/g, '\n')      // trim trailing spaces on lines
    .replace(/\n{3,}/g, '\n\n')      // collapse 3+ newlines to 2
    .split(/\n\s*\n/);               // split on blank line

  parts.forEach((p, i) => {
    const t = p.trim();
    if (!t) return;
    arr.push({
      text: t,
      style: 'paragraph',
      alignment: 'justify',
      lineHeight: 1.35,
      margin: [0, 0, 0, i === parts.length - 1 ? 10 : 6], // paragraph spacing
    });
  });
}

  // --- Cover page ---
  content.push({
    stack: [
      {
        columns: [
          {
            width: '65%',
            stack: [
              {
                text: title || 'Raportin Otsikko',
                style: 'title',
                margin: [0, 20, 99, 255],
                fontSize: 35,
                absolutePosition: { x: 60, y: 70 },
                noWrap: true,
              },
              coverImage
                ? { image: coverImage, width: 300, alignment: 'left', margin: [20, 20, 0, 20] }
                : null,
            ].filter(Boolean),
          },
          {
            width: 1,
            margin: [35, 0, 10, 0],
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 0, y2: 600, lineWidth: 2, lineColor: '#333333' }],
          },
          {
            width: '30%',
            stack: [
              { text: 'INSINÖÖRITOIMISTO\nWAATIVA', alignment: 'left', fontSize: 11, margin: [20, 75, 0, 74] },
              logoBase64
                ? { image: logoBase64, width: 80, alignment: 'center', margin: [20, 75, 0, 74] }
                : null,
            ].filter(Boolean),
          },
        ],
        columnGap: 20,
      },
      {
        text: `Tarkastuspäivämäärä: ${formatFinnishDate(dateIso)}`,
        fontSize: 12,
        absolutePosition: { x: 40, y: 785 },
      },
    ],
    margin: [30, 60, 30, 0],
  });
function fillJohdantoTemplate(template, fields = {}) {
  return template
    .replace('{{toimeksiantaja}}', fields.toimeksiantaja || '')
    .replace('{{koordinaattori}}', fields.koordinaattori || '')
    .replace('{{koordinaattori_title}}', fields.koordinaattori_title || '')
    .replace('{{rakennustekniikka}}', fields.rakennustekniikka || '')
    .replace('{{rakennustekniikka_title}}', fields.rakennustekniikka_title || '')
    .replace('{{lvia}}', fields.lvia || '')
    .replace('{{lvia_title}}', fields.lvia_title || '')
    .replace('{{sahko}}', fields.sahko || '')
    .replace('{{sahko_title}}', fields.sahko_title || '');
}

const intro = sections.find((s) => s.key === 'johdanto' && s.include);
if (intro) {
  pushNumberedSection(content, { title: intro.label, pageBreak: 'before', tocItem: true });

  // Build the aligned table
  const henkilötTable = {
    table: {
      widths: [130, 'auto', '*'],
      body: [
        ['Koordinaattori:', intro.fields?.koordinaattori || '', intro.fields?.koordinaattori_title || ''],
        ['Rakennustekniikka:', intro.fields?.rakennustekniikka || '', intro.fields?.rakennustekniikka_title || ''],
        ['LVIA-järjestelmät:', intro.fields?.lvia || '', intro.fields?.lvia_title || ''],
        ['Sähköjärjestelmät:', intro.fields?.sahko || '', intro.fields?.sahko_title || ''],
      ]
    },
     layout: {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: () => 0,
    paddingRight: () => 20, 
    paddingTop: () => 2,
    paddingBottom: () => 2
  },
  fontSize: 11,
  margin: [0, 5, 0, 10]
};


  const lines = (intro.content || '').split('\n');
  const beforeLines = [];
  const afterLines = [];
  let foundBlock = false;

  for (const line of lines) {
    if (
      line.includes('{{koordinaattori}}') ||
      line.includes('{{rakennustekniikka}}') ||
      line.includes('{{lvia}}') ||
      line.includes('{{sahko}}')
    ) {
      foundBlock = true;
      continue; 
    }
    if (!foundBlock) beforeLines.push(line);
    else afterLines.push(line);
  }

  if (beforeLines.join('\n').trim()) {
    content.push({ text: fillJohdantoTemplate(beforeLines.join('\n'), intro.fields), style: 'paragraph', margin: [0, 0, 0, 10] });
  }

  content.push(henkilötTable);

  if (afterLines.join('\n').trim()) {
    content.push({ text: fillJohdantoTemplate(afterLines.join('\n'), intro.fields), style: 'paragraph', margin: [0, 0, 0, 10] });
  }

 
  content.push(
    { text: 'Käytetyt kuntoluokat:', fontSize: 11, semibold: true, margin: [0, 10, 0, 10] },
    {
      text: [
        { text: 'KL 5', color: '#04aa00', fontSize: 11, semibold: true },
        { text: '   Uusi, ei toimenpiteitä seuraavan 10 vuoden kuluessa\n', fontSize: 11 },
        { text: 'KL 4', color: '#04aa00', fontSize: 11, semibold: true },
        { text: '   Hyvä, kevyt huoltokorjaus 6-10 vuoden kuluessa\n', fontSize: 11 },
        { text: 'KL 3', color: '#FFC107', fontSize: 11, semibold:true },
        { text: '   Tyydyttävä, kevyt huoltokorjaus 1-5 vuoden kuluessa tai peruskorjaus 6-10 vuoden kuluessa\n', fontSize: 11 },
        { text: 'KL 2', color: '#ba3b46', fontSize: 11, semibold: true },
        { text: '   Välttävä, peruskorjaus 1-5 vuoden kuluessa tai uusiminen 6-10 vuoden kuluessa\n', fontSize: 11 },
        { text: 'KL 1', color: '#ba3b46', fontSize: 11, semibold:true },
        { text: '   Heikko, uusitaan 1-5 vuoden kuluessa', fontSize: 11 },
      ],
      margin: [0, 0, 0, 10],
    }
  );
}


  // --- Kohteen tiedot ---
  const rakennukset = rakennusData?.rakennukset_fulls || [];
  if (rakennukset.length > 0) {
    pushNumberedSection(content, {
      title: 'Kohteen Perustiedot',
      pageBreak: 'before',
      tocItem: true,
      id: 'kohteen-perustiedot',
    });

    const rak = rakennukset[0];
    const infoSections = [
      {
        title: 'Yleiset tiedot',
        rows: [
          ['Kohteen nimi', propertyName || 'Asunto Oy Mallila'],
          ['Osoitteet', rak.osoite || '—'],
          ['Toimipaikka', `${rak.postinumero || ''} ${rak.toimipaikka || ''}`.trim()],
        ],
      },
      {
        title: 'Kiinteistötiedot',
        rows: [
          ['Kiinteistötunnus', rakennusData?.kiinteistotunnus || '—'],
          ['Tontin koko', '50505 m²'],
          ['Tontin omistaja', 'Mallilla Oy'],
          ['Yhteystiedot', '0441010101'],
        ],
      },
      {
        title: 'Rakennukset',
        rows: [
          ['Rakennusten lkm.', rakennukset.length],
          ['Ulkorakennusten lkm.', rakennukset.length],
        ],
      },
      {
        title: 'Vuodet',
        rows: [
          ['Rakennusvuosi', rak.rakennusvuosi || '—'],
          ['Peruskorjausvuosi', '—'],
          ['Laajennusvuosi', '—'],
        ],
      },
      {
        title: 'Alat',
        rows: [
          ['Kokonaisala', rak.kokonaisala ? `${rak.kokonaisala} m²` : '—'],
          ['Kerrosala', rak.kerrosala ? `${rak.kerrosala} m²` : '—'],
          ['Huoneistoala', rak.huoneistoala ? `${rak.huoneistoala} m²` : '—'],
          ['Tilavuus', rak.tilavuus ? `${rak.tilavuus} m³` : '—'],
          ['Kerroksia', rak.kerroksia ?? '—'],
          ['Kellarikerroksia', '—'],
        ],
      },
    ];

    const noLinesLayout = {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingTop: () => 3,
      paddingBottom: () => 3,
      paddingLeft: () => 2,
      paddingRight: () => 2,
    };

    infoSections.forEach((section) => {
      content.push({
        stack: [
          { text: section.title, semibold: true, fontSize: 13, margin: [0, 12, 0, 4] },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH, y2: 0, lineWidth: 2, lineColor: '#198754' }], margin: [0, 2, 0, 6] },
        ],
      });

      const tableBody = section.rows.map(([label, value]) => [
        { text: label, semibold: true, fontSize: 11 },
        { text: value || '—', fontSize: 11 },
      ]);

      content.push({
        table: { widths: ['40%', '60%'], body: tableBody },
        layout: noLinesLayout,
        margin: [0, 0, 0, 10],
      });
    });
  }

  // --- SISÄLLYSLUETTELO ---
  content.push({ text: 'SISÄLLYSLUETTELO', style: 'heading', pageBreak: 'before', margin: [0, 20, 0, 10] });
  content.push({
    toc: {
      title: { text: '' },
      numberStyle: 'tocNumber',
      textMargin: [0, 2, 0, 2],
      dotLeader: true,
    },
    style: 'paragraph',
  });

 
  for (const s of sections) {
    if (!s.include || s.key === 'johdanto') continue;

    pushNumberedSection(content, { title: s.label, pageBreak: 'before', tocItem: true });

  if (s.content) {
  pushCleanParagraphs(content, s.content);
}

   
    if (Array.isArray(s.subsections)) {
      s.subsections.forEach((sub) => {
        pushSubsection(content, { title: sub.label, tocItem: true });
       if (sub.text) {
  pushCleanParagraphs(content, sub.text);
}
      });
    }

    if (s.images?.length) {
      const rows = [];
      for (let i = 0; i < s.images.length; i += 2) {
        const row = s.images.slice(i, i + 2).map((img) => ({
          stack: [
            { image: img.url, width: 240, height: 160, preserveAspectRatio: false, alignment: 'center', margin: [0, 0, 0, 5] },
            { text: img.caption || '', fontSize: 9, alignment: 'center', italics: true, margin: [0, 2, 0, 0] },
          ],
          width: '50%',
        }));
        rows.push({ columns: row, columnGap: 10 });
      }
      content.push(...rows, { text: '', margin: [0, 10] });
    }

function addHeadingsWithImages(content, ptsHeadings, ptsImages, sectionCounter, currentSub) {
  if (Array.isArray(ptsImages) && ptsImages.length) {
    ptsHeadings.forEach((heading, i) => {
      const imgStr = ptsImages[i];

      content.push({
        stack: [
{
  text: `${sectionCounter}.${currentSub + 1} ${heading.toUpperCase()}`,
  style: 'subHeading',
  margin: [0, 12, 0, 6],
  tocItem: true,        // ✅ tells pdfmake to include in TOC
  id: `${sectionCounter}_${currentSub + 1}` // ✅ unique anchor for linking
},
          imgStr
            ? { 
                image: imgStr, 
                width: CONTENT_WIDTH-5, // ✅ same usable width as header
                preserveAspectRatio: true, 
                margin: [0, 0, 0, 10], 
                alignment: 'center' 
              }
            : { 
                text: 'Image not available', 
                italics: true, 
                alignment: 'center', 
                margin: [0, 0, 0, 10] 
              }
        ],
        unbreakable: true, // ensures heading + image stick together
      });

      currentSub++;
    });
  }

  return currentSub; // return updated counter
}

  if (s.key === 'pts-ehdotukset') {
    const ptsHeadings = [
      'Yhteenvetotaulukko',
      'Lisätutkimukset',
      'Rakennetekniikan PTS',
      'LVI-Tekniikan PTS',
      'Sähköjärjestelmien PTS'
    ];

    // call the reusable function instead of inlining the loop
    currentSub = addHeadingsWithImages(content, ptsHeadings, ptsImages, sectionCounter, currentSub);
  }


    if (s.key === 'jarjestelma') {
      content.push(
        { text: 'Riskiluokitus', fontSize: 14, semibold: true, margin: [0, 10, 0, 10] },
        {
          text: [
            { text: '√ ', color: '#04aa00', fontSize: 15 }, { text: ' Matala riski\n', fontSize: 11 },
            { text: '√ ', color: '#d0c407', fontSize: 15 }, { text: ' Keskitason riski\n', fontSize: 11 },
            { text: '√ ', color: '#ba3b46', fontSize: 15 }, { text: ' Korkea riski', fontSize: 11 },
          ],
          margin: [0, 0, 0, 10],
        }
      );

      const tableLayout = {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 4,
        paddingRight: () => 4,
        paddingTop: () => 3,
        paddingBottom: () => 3,
      };

      const grouped = riskidata.reduce((acc, item) => {
        (acc[item.category] ||= []).push(item);
        return acc;
      }, {});

      for (const [category, items] of Object.entries(grouped)) {
        const tableBody = items.map((item) => [
          { text: item.label, fontSize: 11 },
          {
            columns: [
              { text: '√', color: item.risk === 'low' ? 'green' : item.risk === 'medium' ? 'orange' : 'red', fontSize: 11 },
              { text: item.description || '', fontSize: 11 },
            ],
            columnGap: 6,
          },
        ]);

        content.push({
          stack: [
            { text: category.toUpperCase(), fontSize: 14, semibold: true, margin: [0, 2, 0, 0] },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH, y2: 0, lineWidth: 1, lineColor: '#008000' }], margin: [0, 2, 0, 2] },
            { table: { widths: ['30%', '70%'], body: tableBody }, layout: tableLayout, margin: [0, 0, 0, 4] },
          ],
          unbreakable: true,
        });
      }
    }
  }




return {
  content,
  pageMargins: [30, 60, 30, 40],
  defaultStyle: { font: 'Lato', fontSize: 12 },
  styles: {
    title: { font: 'JosefinSans', fontSize: 36, semibold: true },
    heading: { font: 'JosefinSans', fontSize: 18, semibold: true },
    sectionHeading: { font: 'JosefinSans', fontSize: 16, semibold: true },
    subHeading: { font: 'JosefinSans', fontSize: 13, semibold: true }, 
    paragraph: { font: 'Lato', fontSize: 11, alignment: 'justify', lineHeight: 1.35, characterSpacing: 0.1 },
  },
    header: (currentPage) => {
      if (currentPage === 1) return null;

      const dateText = new Date().toLocaleDateString('fi-FI');
      const propertyText = propertyName || 'ASUNTO OY MALLILA';

      return {
        margin: [30, 10],
        table: {
          widths: ['auto', '*'], // left = date, right = remaining space
          body: [[
            { 
              text: dateText, 
              color: 'white', 
              bold: true,
              margin: [5, 0, 0, 0] // extra 5px padding on the left
            },
            { 
              text: propertyText, 
              color: 'white', 
              bold: true, 
              alignment: 'right', 
              margin: [0, 0, 5, 0] // extra 15px padding on the right
            }
          ]]
        },
        layout: {
          fillColor: '#04aa00',
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingTop: () => 7,
          paddingBottom: () => 7
        }
      };
    }
  };
}
