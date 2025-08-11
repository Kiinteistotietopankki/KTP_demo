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
}) {
  const content = [];

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
              coverImage ? { image: coverImage, width: 300, alignment: 'left', margin: [20, 20, 0, 20] } : null,
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
              logoBase64 ? { image: logoBase64, width: 80, alignment: 'center', margin: [20, 75, 0, 74] } : null,
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

  // --- Johdanto ---
  const intro = sections.find((s) => s.key === 'johdanto' && s.include);
  if (intro) {
    content.push(
     { text: intro.label.toUpperCase(), style: 'sectionTitle', pageBreak: 'before', margin: [0, 10, 0, 35], tocItem: true },
      { text: intro.content || '', style: 'paragraph', margin: [0, 0, 0, 10] }
      
    );
  }

  // --- Kohteen tiedot ---
  const rakennukset = rakennusData?.rakennukset_fulls || [];
  if (rakennukset.length > 0) {
    content.push({
      text: 'Kohteen Perustiedot',
      style: 'heading',
      pageBreak: 'before',
      margin: [0, 10, 0, 10],
        tocItem: true,
  id: 'kohteen-perustiedot'
});
   

    const rak = rakennukset[0];
    const infoSections = [
      { title: 'Yleiset tiedot', rows: [
        ['Kohteen nimi', propertyName || 'Asunto Oy Mallila'],
        ['Osoitteet', rak.osoite || '—'],
        ['Toimipaikka', `${rak.postinumero || ''} ${rak.toimipaikka || ''}`.trim()],
      ]},
      { title: 'Kiinteistötiedot', rows: [
        ['Kiinteistötunnus', rakennusData?.kiinteistotunnus || '—'],
        ['Tontin koko', '50505 m²'],
        ['Tontin omistaja', 'Mallilla Oy'],
        ['Yhteystiedot', '0441010101'],
      ]},
      { title: 'Rakennukset', rows: [
        ['Rakennusten lkm.', rakennukset.length],
        ['Ulkorakennusten lkm.', rakennukset.length],
      ]},
      { title: 'Vuodet', rows: [
        ['Rakennusvuosi', rak.rakennusvuosi || '—'],
        ['Peruskorjausvuosi', '—'],
        ['Laajennusvuosi', '—'],
      ]},
      { title: 'Alat', rows: [
        ['Kokonaisala', rak.kokonaisala ? `${rak.kokonaisala} m²` : '—'],
        ['Kerrosala', rak.kerrosala ? `${rak.kerrosala} m²` : '—'],
        ['Huoneistoala', rak.huoneistoala ? `${rak.huoneistoala} m²` : '—'],
        ['Tilavuus', rak.tilavuus ? `${rak.tilavuus} m³` : '—'],
        ['Kerroksia', rak.kerroksia ?? '—'],
        ['Kellarikerroksia', '—'],
      ]},
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
          { text: section.title, bold: true, fontSize: 13, margin: [0, 12, 0, 4], },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#198754' }], margin: [0, 2, 0, 6] },
        ],
      });

      const tableBody = section.rows.map(([label, value]) => [
        { text: label, bold: true, fontSize: 11 },
        { text: value || '—', fontSize: 11 },
      ]);

      content.push({
        table: { widths: ['40%', '60%'], body: tableBody },
        layout: noLinesLayout,
        margin: [0, 0, 0, 10],
      });
    });
  }
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

  // --- Rest of sections ---
  for (const s of sections) {
    if (!s.include || s.key === 'johdanto') continue;

    content.push({ text: s.label.toUpperCase(), style: 'sectionTitle', pageBreak: 'before', margin: [0, 10, 0, 5],tocItem: true });
    

    if (s.content) content.push({ text: s.content, style: 'paragraph', margin: [0, 0, 0, 10] });

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
        const tableBody = items.map(item => [
          { text: item.label, fontSize: 11 },
          {
            columns: [
              { text: '√', color: item.risk === 'low' ? 'green' : item.risk === 'medium' ? 'orange' : 'red', fontSize: 11 },
              { text: item.description || '', fontSize: 11 },
            ],
            columnGap: 6,
          }
        ]);

        content.push({
          stack: [
            { text: category.toUpperCase(), fontSize: 14, bold: true, margin: [0, 2, 0, 0] },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#008000' }], margin: [0, 2, 0, 2] },
            { table: { widths: ['30%', '70%'], body: tableBody }, layout: tableLayout, margin: [0, 0, 0, 4] },
          ],
          unbreakable: true,
        });
      }
    }
  }

  return {
    content,
    pageMargins: [30, 50, 30, 40],
    defaultStyle: { font: 'Lato', fontSize: 12 },
    styles: {
      title: { font: 'JosefinSans', fontSize: 36, semibold: true },
      heading: { font: 'JosefinSans', fontSize: 18, semibold: true },
      sectionTitle: {  font: 'JosefinSans',
    fontSize: 16,
    semibold: true,
    decoration: 'underline', // <- underline text
    decorationStyle: 'solid',
    decorationColor: '#000000'},
      paragraph: { font: 'Lato', fontSize: 11 },
    
},
    header: (currentPage) => {
      if (currentPage === 1) return null;
      const sidePadding = 30;
      const bannerWidth = 595 - 2 * sidePadding;
      return {
        margin: [0, 0, 0, 10],
        stack: [
          { canvas: [{ type: 'rect', x: sidePadding, y: 0, w: bannerWidth, h: 20, color: '#008000' }] },
          { text: `${new Date().toLocaleDateString('fi-FI')}  |  ${propertyName || 'ASUNTO OY MALLILIA'}`, fontSize: 9, color: 'white', absolutePosition: { x: sidePadding + 5, y: 5 } },
        ],
      };
    },
  };
}
