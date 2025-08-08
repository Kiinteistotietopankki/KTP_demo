import { useState, useRef } from 'react';
import 'handsontable/dist/handsontable.full.min.css';
import { Riskidataa } from '../assets/Riskidata';
import { useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake'
import '../fonts/josefin-fonts.js';
import'../fonts/Lato-fonts.js';
import { Accordion } from 'react-bootstrap';
import JohdantoText from '../Static/johdando';
import Jarjestelmakuvaus from '../Static/Jarjestelmariskikuvaus';
import PTSLongTermTable from './PTS/PTSLongTermTable.js';
import { Tab, Tabs } from 'react-bootstrap';
import ImageUploadCategorizer from './ImageUpload.js';
import logo from '../assets/images/waativalogo.png'; 

const PropertyDetailsForm = ({ rakennus, kiinteistotunnus, initialTab, rakennusData: initialRakennusData }) => {
  const savedData = JSON.parse(localStorage.getItem('reportFormData')) || {};
  useEffect(() => {
    console.log('🔍 Kiinteistötunnus received:', kiinteistotunnus);
  }, [kiinteistotunnus]);
  const [rakennusData, setRakennusData] = useState(initialRakennusData || null);
  useEffect(() => {
  console.log('📦 rakennusData in editor:', rakennusData);
}, [rakennusData]);
  const [activeTab, setActiveTab] = useState(initialTab || 'report');
  const [title, setTitle] = useState(savedData.title || '');
  const [customText, setCustomText] = useState(savedData.customText || '');
  const card = rakennusData;
  const [PropertyName, setPropertyName] = useState(savedData.PropertyName || '');
  const [propertyId, setPropertyId] = useState(kiinteistotunnus);
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null);
  const [riskidata, setRiskidata] = useState(savedData.riskidata || Riskidataa);
const [previewUrl, setPreviewUrl] = useState(null);
const [showPreviewModal, setShowPreviewModal] = useState(false);
const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%
const formatFinnishDate = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
};


const [logoBase64, setLogoBase64] = useState(null);

useEffect(() => {
  fetch(logo)
    .then(res => res.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onloadend = () => setLogoBase64(reader.result);
      reader.readAsDataURL(blob);
    });
}, []);

// raporttipohjat
const templates = {
  wpts: {
    name: 'W-PTS KATSELMUS',
    defaultSections: [
      
      { key: 'johdanto', label: '📝 Johdanto', content: JohdantoText.Option1, include: true, images: [] },
      { key: 'jarjestelma', label: '⚙️ Järjestelmäkuvaukset ja Riskiluokitus', content: Jarjestelmakuvaus.option1, include: true, images: [] },
      { key: 'rakennetekniikka', label: '🏗️ Rakennetekniikkan Kuvat', content: '', include: true, images: [] },
      { key: 'lvi', label: '💧 LVI-Tekniikan Kuvat', content: '', include: true, images: [] },
      { key: 'sahko', label: '⚡ Sähköjärjestelmien Kuvat', content: '', include: true, images: [] },
      { key: 'lähtötiedot', label: 'Lähtötiedot', content: '', include: true, images: [] },
      { key: 'havainnot', label: 'Merkittävimmät havainnot', content: '', include: true, images: [] },
      { key: 'allekirjoitus', label: 'Allekirjoitukset', content: '', include: false, images: [] },
    ]
  },

  wk1: {
    name: 'KUNTOARVIO WK1',
    defaultSections: [
      
      { key: 'johdanto', label: '📘 Yleiskuvaus', content: '', include: true, images: [] },
      { key: 'kuntoarvio', label: '🔎 Kuntoarviointi', content: '', include: true, images: [] },
      { key: 'riskit', label: '⚠️ Riskit ja Huomiot', content: '', include: true, images: [] },
      { key: 'toimenpide', label: '🛠️ Suositellut Toimenpiteet', content: '', include: true, images: [] },
      { key: 'allekirjoitus', label: '✍️ Allekirjoitukset', content: '', include: true, images: [] },
    ]
  },
    Markatila: {
    name: 'MÄRKÄTILA WK1',
    defaultSections: [
      
      { key: 'johdanto', label: '📘 Yleiskuvaus', content: '', include: true, images: [] },
      { key: 'kuntoarvio', label: '🔎 Kuntoarviointi', content: '', include: true, images: [] },
      { key: 'riskit', label: '⚠️ Riskit ja Huomiot', content: '', include: true, images: [] },
      { key: 'toimenpide', label: '🛠️ Suositellut Toimenpiteet', content: '', include: true, images: [] },
      { key: 'allekirjoitus', label: '✍️ Allekirjoitukset', content: '', include: true, images: [] },
    ]
  },
    wk3: {
    name: 'KUNTOARVIO WK3',
    defaultSections: [
      
      { key: 'johdanto', label: '📘 Yleiskuvaus', content: '', include: true, images: [] },
      { key: 'kuntoarvio', label: '🔎 Kuntoarviointi', content: '', include: true, images: [] },
      { key: 'riskit', label: '⚠️ Riskit ja Huomiot', content: '', include: true, images: [] },
      { key: 'toimenpide', label: '🛠️ Suositellut Toimenpiteet', content: '', include: true, images: [] },
      { key: 'allekirjoitus', label: '✍️ Allekirjoitukset', content: '', include: true, images: [] },
    ]
  },
};


const defaultTemplateKey = savedData.selectedTemplate || 'wpts';
const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplateKey);
const [sections, setSections] = useState(savedData.sections || templates[defaultTemplateKey].defaultSections);

  
  
  const resetForm = () => {
   setTitle('W-PTS KATSELMUS');
    setCustomText('');
    setPropertyName('');
    setCoverImage(null);
    setRiskidata(Riskidataa);
    setSections([
      
      { key: 'johdanto', label: '📝 Johdanto', content: '', include: false, images: [] },
      { key: 'jarjestelma', label: '⚙️ Järjestelmäkuvaukset ja Riskiluokitus', content: '', include: false, images: [] },
      { key: 'rakennetekniikka', label: '🏗️ Rakennetekniikkan Kuvat', content: '', include: false, images: [] },
      { key: 'lvi', label: '💧 LVI-Tekniikan Kuvat', content: '', include: false, images: [] },
      { key: 'sahko', label: '⚡ Sähköjärjestelmien Kuvat', content: '', include: false, images: [] },
      { key: 'lähtötiedot', label: 'Lähtötiedot', content: '', include: false, images: [] },
    { key: 'havainnot', label: ' Merkittävimmät havainnot ', content: '', include: false, images: [] },
    { key: 'allekirjoitus', label: ' Allekirjoitukset', content: '', include: false, images: [] },
    ]);
    localStorage.removeItem('reportFormData');
  };

useEffect(() => {
  if (initialRakennusData) {
    setRakennusData(initialRakennusData);
  }
}, [initialRakennusData]);
useEffect(() => {
  const parsed = savedData;
  setTitle(parsed.title || '');
  setCustomText(parsed.customText || '');
  setPropertyName(parsed.PropertyName || '');
  setCoverImage(parsed.coverImage || null);
  setRiskidata(parsed.riskidata || Riskidataa);
  if (!parsed.sections) {
    setSections(templates[defaultTemplateKey].defaultSections);
  }
}, []);
useEffect(() => {
  if (activeTab === 'preview') {
    const generatePreview = async () => {
      const docDefinition = await buildPdfContent();
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl); 
        const blobUrl = URL.createObjectURL(blob);
        setPreviewUrl(blobUrl);
      });
    };
    generatePreview();
  }
}, [activeTab]);

useEffect(() => {
  const formData = {
    title,
    customText,
    PropertyName,
    coverImage,
    riskidata,
    sections,
    selectedTemplate,
    sections: sections.map(section => ({
      ...section,
      images: [],
    }))
  };

  try {
    localStorage.setItem('reportFormData', JSON.stringify(formData));
  } catch (error) {
    console.warn('⚠️ Could not save to localStorage:', error);
  }
}, [title, customText, PropertyName, coverImage, riskidata, sections, selectedTemplate]);

  
 
  const handleAddCustomSection = () => {
    const header = prompt('Anna uuden osion otsikko:');
    if (header) {
      const newSection = { 
        key: `custom-${Date.now()}`, 
        label: header, 
        content: '', 
        include: true, 
        images: [] 
      };
  
      setSections((prevSections) => {
        const firstKuvatIndex = prevSections.findIndex(
          (section) =>
            section.key === 'rakennetekniikka' ||
            section.key ===  'Kohteenkuvatkuvat' ||
            section.key === 'lvi' ||
            section.key === 'sahko' ||
            section.key ==='lähtötiedot'||
            section.key ==='havainnot' 
            
        );
  
        if (firstKuvatIndex === -1) {
          return [...prevSections, newSection];
        } else {
          const updatedSections = [...prevSections];
          updatedSections.splice(firstKuvatIndex, 0, newSection);
          return updatedSections;
        }
      });
    }
  };
  
  
  const hotTableRef = useRef(null);
  const buildPdfContent = async () => {
  const content = [];

  
  // Otsikkosivu
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
        noWrap: true,
        fontSize: 35,
        absolutePosition: { x: 60, y: 70 }, 
      noWrap: true,
    },
      coverImage
        ? {
            image: coverImage,
            width: 300,
            alignment: 'left',
            margin: [20, 20, 0, 20],
          }
        : null,
    ],
  },
  {
    width: 1,
    margin: [35, 0, 10, 0],
    canvas: [
      {
        type: 'line',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 600,
        lineWidth: 2,
        lineColor: '#333333',
      },
    ],
  },
  {
    width: '30%',
    stack: [
      {
        text: 'INSINÖÖRITOIMISTO\nWAATIVA',
        alignment: 'left',
        fontSize: 11,
        margin: [20, 75, 0, 74],
      },
      logoBase64
        ? {
            image: logoBase64,
            width: 80,
            alignment: 'center',
            margin: [20, 75, 0, 74],
          }
        : null,
    ],
  },
],
  
      columnGap: 20,
    },

   
    {
      text: `Tarkastuspäivämäärä: ${formatFinnishDate(customText)}`,
      fontSize: 12,
      absolutePosition: { x: 40, y: 785 },
    },
  ],
  margin: [30, 60, 30, 0],
   
});

  const johdantoSection = sections.find((s) => s.key === 'johdanto' && s.include);
if (johdantoSection) {
  content.push(
    {
      text: johdantoSection.label.toUpperCase(),
      style: 'sectionTitle',
      pageBreak: 'before',
      margin: [0, 10, 0, 5]
    },
    {
      text: johdantoSection.content || '',
      style: 'paragraph',
      margin: [0, 0, 0, 10]
    }
  );
}
const rakennukset = rakennusData?.rakennukset_fulls || [];
if (rakennukset.length > 0) {
  content.push({
    text: '🏠 Kohteen tiedot',
    style: 'heading',
    pageBreak: 'before',
    margin: [0, 10, 0, 10],
  });

  const rak = rakennukset[0];

  const sections = [
    {
      title: 'Yleiset tiedot',
      rows: [
        ['Kohteen nimi', PropertyName || 'Asunto Oy Mallila'],
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

  sections.forEach((section) => {
    content.push({
      stack: [
        {
          text: section.title,
          bold: true,
          fontSize: 13,
          margin: [0, 12, 0, 4],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 2,
              lineColor: '#198754', // Bootstrap green
            },
          ],
          margin: [0, 2, 0, 6],
        },
      ],
    });

    const tableBody = section.rows.map(([label, value]) => [
      { text: label, bold: true, fontSize: 11 },
      { text: value || '—', fontSize: 11 },
    ]);

    content.push({
      table: {
        widths: ['40%', '60%'],
        body: tableBody,
      },
      layout: noLinesLayout,
      margin: [0, 0, 0, 10],
    });
  });
}



content.push({
  text: 'SISÄLLYSLUETTELO',
  style: 'heading',
  pageBreak: 'before',
  margin: [0, 20, 0, 10],
});

content.push({
  toc: {
    title: { text: '' },
    numberStyle: 'tocNumber',
    textMargin: [0, 2, 0, 2],
    dotLeader: true,
  },
  style: 'paragraph',
});


  let pageCounter = 3;
  let tocIndex = 1;



  sections.forEach((section) => {
  if (section.include) {
    const label = section.label.replace(/^(\W*\s*)/, '');
    const pageNum = pageCounter++;
    const tocLine = `${tocIndex++}. ${label}`;
    const dots = '.'.repeat(175 - tocLine.length - pageNum.toString().length);

    content.push({
      text: `${tocLine} ${dots} ${pageNum}`,
      style: 'paragraph',
      margin: [0, 2],
    });
  }
});


  let first = true;
for (const section of sections) {
  if (!section.include || section.key === 'johdanto') continue; 

    content.push({
      text: section.label.toUpperCase(),
      style: 'sectionTitle',
      pageBreak:'before',
      margin: [0, 10, 0, 5]
    });

    first = false;

    if (section.content) {
      content.push({ text: section.content, style: 'paragraph', margin: [0, 0, 0, 10] });
    }

    if (section.images && section.images.length) {
      const imagesPerRow = 2;
      const imageRows = [];

      for (let i = 0; i < section.images.length; i += imagesPerRow) {
 const rowImages = section.images.slice(i, i + imagesPerRow).map((img) => ({
  stack: [
    {
      image: img.url,
      width: 220,
      height: 160,
      fit: [300, 160],
      alignment: 'center',
      margin: [0, 0, 0, 4],
    },
    {
      text: img.caption || '',
      fontSize: 9,
      alignment: 'center',
      margin: [0, 2, 0, 0],
    }
  ],
  width: 'auto',
}));

  imageRows.push({ columns: rowImages, columnGap: 10 });
}


      content.push(...imageRows, { text: '', margin: [0, 10] });
    }

    if (section.key === 'jarjestelma') {
      content.push(
        { text: 'Riskiluokitus', fontSize: 14, semibold: true, margin: [0, 10, 0, 10] },
        {
          text: [
            { text: '√ ', color: '#04aa00', fontSize: 15 },
            { text: ' Matala riski\n', fontSize: 11 },
            { text: '√ ', color: '#d0c407', fontSize: 15 },
            { text: ' Keskitason riski\n', fontSize: 11 },
            { text: '√ ', color: '#ba3b46', fontSize: 15 },
            { text: ' Korkea riski', fontSize: 11 },
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
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {});

for (const [category, items] of Object.entries(grouped)) {
  const tableBody = items.map(item => [
    { text: item.label, fontSize: 11 },
    {
      columns: [
        {
          text: '√',
          color:
            item.risk === 'low' ? 'green' :
            item.risk === 'medium' ? 'orange' : 'red',
          fontSize: 11
        },
        { text: item.description || '', fontSize: 11 }
      ],
      columnGap: 6
    }
  ]);

 content.push({
  stack: [
    {
      text: category.toUpperCase(),
      fontSize: 14,
      bold: true,
      margin: [0, 2, 0, 0] 
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 515,
          y2: 0,
          lineWidth: 1,
          lineColor: '#008000'
        }
      ],
      margin: [0, 2, 0, 2] 
    },
    {
      table: { widths: ['30%', '70%'], body: tableBody },
      layout: tableLayout,
      margin: [0, 0, 0, 4] 
    }
  ],
  unbreakable: true
});
}}}

  const docDefinition = {
    content,
    pageMargins: [30, 50, 30, 40],
    defaultStyle: { font: 'Lato', fontSize: 12 },
    styles: {
      title: { font: 'JosefinSans', fontSize: 36, semibold: true },
      heading: { font: 'JosefinSans', fontSize: 18, semibold: true },
      sectionTitle: { font: 'JosefinSans', fontSize: 16, Regular: true },
      paragraph: { font: 'Lato', fontSize: 11 },
    },
    header: (currentPage, pageCount) => {
      if (currentPage === 1) return null;
      const sidePadding = 30;
      const bannerWidth = 595 - 2 * sidePadding;
      return {
        margin: [0, 0, 0, 10],
        stack: [
          {
            canvas: [
              { type: 'rect', x: sidePadding, y: 0, w: bannerWidth, h: 20, color: '#008000' },
            ],
          },
          {
            text: `${new Date().toLocaleDateString('fi-FI')}  |  ${PropertyName || 'ASUNTO OY MALLILIA'}`,
            fontSize: 9,
            color: 'white',
            absolutePosition: { x: sidePadding + 5, y: 5 },
          },
        ],
      };
    },
  };

  return docDefinition;
};

   const handleExportPdf = async () => {
  const docDefinition = await buildPdfContent();
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  pdfDocGenerator.getBlob(async (blob) => {
    try {
      const formData = new FormData();
      const templateName = templates[selectedTemplate]?.name || 'Raportti';
      const fileName = `${templateName}_${PropertyName || 'Kohde'}.pdf`;

      formData.append('pdf', blob, fileName);

      const response = await fetch('http://localhost:3001/uploadpdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('✅ Upload to SharePoint result:', data);
    } catch (err) {
      console.error('❌ Upload error:', err);
    }

    const templateName = templates[selectedTemplate]?.name || 'Raportti';
    const fileName = `${templateName}_${PropertyName || 'Kohde'}.pdf`;
    pdfDocGenerator.download(fileName);
  });
  resetForm();
};

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };
return (
  <Tabs
  activeKey={activeTab}
  onSelect={(k) => setActiveTab(k)}
  id="report-tabs"
  className="mb-3"
>
    <Tab eventKey="report" title="Raportti">
      <div className="p-4 space-y-6">
        <label className="font-semibold text-sm">Valitse raporttipohja:</label>
        <select
  className="form-select mt-1"
  value={selectedTemplate}
onChange={(e) => {
  const newKey = e.target.value;
  const newTemplateName = templates[newKey]?.name || '';

  setSelectedTemplate(newKey);
  setSections(templates[newKey].defaultSections);
  setTitle(newTemplateName); // ← always update title
}}

>
          {Object.entries(templates).map(([key, tpl]) => (
            <option key={key} value={key}>{tpl.name}</option>
          ))}
        </select>

        <div className="p-4 space-y-6">
          {/* Kansisivu */}
          <div className="border p-4 rounded shadow-sm">
            <h3 className="text-xl font-semibold mb-4">📄 Kansisivu</h3>
          <div className="form-control mb-3" readOnly>
              {title}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="form-control mb-3"
            />
            <input
              type="text"
              value={PropertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="Kohteen nimi"
              className="form-control mb-3"
            />
            
           <input
              type="date"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="form-control"
            />
          </div>

<Accordion defaultActiveKey="0" className="mb-4">
  <Accordion.Item eventKey="0">
    <Accordion.Header>🏠 Kohteen tiedot</Accordion.Header>
    <Accordion.Body>
      <div className="mb-4 px-2 px-md-4">

        {/* Section 1: Yleiset tiedot */}
        <div className="table-responsive">
          <table className="table">
            <tbody>
              <tr>
                <td className="fw-semibold" style={{ width: '40%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  Kohteen nimi
                </td>
                <td style={{ width: '60%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  Asunto Oy Mallila
                </td>
              </tr>
              <tr>
                <td className="fw-semibold" style={{ width: '40%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  Osoitteet
                </td>
                <td style={{ width: '60%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  {card?.rakennukset_fulls[0]?.osoite || '—'}
                </td>
              </tr>
              <tr>
                <td className="fw-semibold" style={{ width: '40%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  Toimipaikka
                </td>
                <td style={{ width: '60%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  {card?.rakennukset_fulls[0]?.postinumero} {card?.rakennukset_fulls[0]?.toimipaikka}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-top border-success my-3" style={{ height: '3px' }} />

        {/* Section 2: Kiinteistötiedot */}
        <div className="table-responsive">
          <table className="table">
            <tbody>
              {[
                ['Kiinteistötunnus', card?.kiinteistotunnus || '—'],
                ['Tontin koko', '50505 m²'],
                ['Tontin omistaja', 'Mallilla Oy'],
                ['Yhteystiedot', '0441010101'],
              ].map(([label, value], idx) => (
                <tr key={idx}>
                  <td className="fw-semibold" style={{ width: '40%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{label}</td>
                  <td style={{ width: '60%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-top border-success my-3" style={{ height: '3px' }} />

        {/* Section 3: Rakennusten lkm */}
        <div className="table-responsive">
          <table className="table">
            <tbody>
              {[
                ['Rakennusten lkm.', card?.rakennukset_fulls?.length || '—'],
                ['Ulkorakennusten lkm.', card?.rakennukset_fulls?.length || '—'],
              ].map(([label, value], idx) => (
                <tr key={idx}>
                  <td className="fw-semibold" style={{ width: '40%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{label}</td>
                  <td style={{ width: '60%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-top border-success my-3" style={{ height: '3px' }} />

        {/* Section 4: Vuodet */}
        <div className="table-responsive">
          <table className="table">
            <tbody>
              {[
                ['Rakennusvuosi', card?.rakennukset_fulls[0]?.rakennusvuosi || '—'],
                ['Peruskorjausvuosi', '—'],
                ['Laajennusvuosi', '—'],
              ].map(([label, value], idx) => (
                <tr key={idx}>
                  <td className="fw-semibold" style={{ width: '40%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{label}</td>
                  <td style={{ width: '60%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-top border-success my-3" style={{ height: '3px' }} />

        {/* Section 5: Mitat */}
        <div className="table-responsive">
          <table className="table">
            <tbody>
              {[
                ['Kokonaisala', `${card?.rakennukset_fulls[0]?.kokonaisala} m²`],
                ['Kerrosala', `${card?.rakennukset_fulls[0]?.kerrosala} m²`],
                ['Huoneistoala', `${card?.rakennukset_fulls[0]?.huoneistoala} m²`],
                ['Tilavuus', `${card?.rakennukset_fulls[0]?.tilavuus} m³`],
                ['Kerroksia', card?.rakennukset_fulls[0]?.kerroksia],
                ['Kellarikerroksia', '—'],
              ].map(([label, value], idx) => (
                <tr key={idx}>
                  <td className="fw-semibold" style={{ width: '40%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{label}</td>
                  <td style={{ width: '60%', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>



{['rakennetekniikka', 'sahko', 'lvi'].map((key) => {
  const sectionIndex = sections.findIndex((s) => s.key === key);
  const labels = {
    rakennetekniikka: '📷 Rakenne-kuvat',
    sahko: '📷 Sähkö-kuvat',
    lvi: '📷 LVI-kuvat',
  };

  return sectionIndex !== -1 ? (
    <div className="border p-4 rounded shadow-sm my-4" key={key}>
      <h4 className="text-md fw-semibold mb-3">{labels[key]}</h4>
      <ImageUploadCategorizer
        sections={sections}
        setSections={setSections}
        sectionKey={key}
      />
    </div>
  ) : null;
})}


          
          <div className="accordion my-4" id="templateAccordion">
  {sections.map((section, index) => (
    <div
  className={`accordion-item ${section.include ? 'active-section' : ''}`}
  key={section.key}
>
     <h2
  className={`accordion-header d-flex align-items-center justify-content-between ${section.include ? 'active-section' : ''}`}
  id={`template-heading-${index}`}
>

  <div className="d-flex w-100 justify-content-between align-items-center">
    <button
      className={`accordion-button ${!section.include ? 'collapsed' : ''}`}
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={`#template-collapse-${index}`}
      aria-expanded={section.include ? 'true' : 'false'}
      aria-controls={`template-collapse-${index}`}
      onClick={() => {
        const updated = [...sections];
        updated[index].include = !updated[index].include;

        if (updated[index].include && section.key === 'johdanto' && !updated[index].content) {
          updated[index].content = JohdantoText.Option1;
        }
        if (updated[index].include && section.key === 'jarjestelma' && !updated[index].content) {
          updated[index].content = Jarjestelmakuvaus.option1;
        }

        setSections(updated);
      }}
    >
      {section.label}
    </button>

    {section.key.startsWith('custom-') && (
      <button
        className="btn btn-sm btn-outline-danger me-3"
        onClick={() => {
          const updated = [...sections];
          updated.splice(index, 1);
          setSections(updated);
        }}
      >
        🗑️
      </button>
    )}
  </div>
</h2>


      <div
        id={`template-collapse-${index}`}
        className={`accordion-collapse collapse ${section.include ? 'show' : ''}`}
        aria-labelledby={`template-heading-${index}`}
        
      >
        <div className="accordion-body">
          {![ 'rakennetekniikka', 'lvi', 'sahko'].includes(section.key) && (
  <textarea
    className="form-control mb-3"
    rows="8"
    value={section.content}
    onChange={(e) => {
      const updated = [...sections];
      updated[index].content = e.target.value;
      setSections(updated);
    }}
  />
)}

{section.key === 'kohteenkuvat' && (
  <ImageUploadCategorizer sections={sections} setSections={setSections} />
)}


{section.images && section.images.length > 0 && (
  <div className="mt-3 d-flex flex-wrap gap-3">
    {section.images.map((img, imgIndex) => (
      <div
  key={imgIndex}
  className="position-relative border rounded p-2 text-center d-flex flex-column align-items-center"
  style={{ width: 160 }}
>
  <button
    type="button"
    onClick={() => {
      const updated = [...sections];
      updated[index].images = updated[index].images.filter((_, i) => i !== imgIndex);
      setSections(updated);
    }}
    style={{
      position: 'absolute',
      top: '4px',
      right: '6px',
      background: 'transparent',
      border: 'none',
      color: 'red',
      fontWeight: 'bold',
      fontSize: '1.25rem',
      cursor: 'pointer',
      lineHeight: '1',
    }}
  >
    X
  </button>

 
  <img
    src={img.url}
    alt={`kuva-${imgIndex}`}
    style={{
      width: '100%',
      height: 100,
      objectFit: 'cover',
      borderRadius: 6,
      marginBottom: 4
    }}
  />

  
  <input
    type="text"
    className="form-control form-control-sm"
    placeholder="Kuvateksti"
    value={img.caption || ''}
    onChange={(e) => {
      const updated = [...sections];
      updated[index].images[imgIndex].caption = e.target.value;
      setSections(updated);
    }}
    style={{ fontSize: '0.75rem' }}
  />
</div>

    ))}
  </div>
)}


{section.key === 'jarjestelma' && (
  <div className="mt-4 space-y-2">
   

    {Object.entries(
      riskidata.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {})
    ).map(([category, items]) => (
      <div key={category} className="mb-4">
        <h5 className="fw-bold border-bottom border-success pb-1 text-uppercase">
          {category}
        </h5>

        {items.map((item) => (
          <div key={item.id} className="row align-items-center mb-3">
  <div className="col-12 col-md-3">
    <strong>{item.label}</strong>
  </div>

  <div className="col-2 col-md-1 text-center">
    <span
      style={{
        fontSize: '1.2rem',
        color:
          item.risk === 'low'
            ? 'green'
            : item.risk === 'medium'
            ? 'orange'
            : 'red',
      }}
    >
      ✓
    </span>
  </div>

  <div className="col-10 col-md-3 mb-2 mb-md-0">
    <select
      className="form-select form-select-sm"
      value={item.risk}
      onChange={(e) => {
        const updated = [...riskidata];
        updated[
          riskidata.findIndex((i) => i.id === item.id)
        ].risk = e.target.value;
        setRiskidata(updated);
      }}
    >
      <option value="low">Matala riski</option>
      <option value="medium">Keskitason riski</option>
      <option value="high">Korkea riski</option>
    </select>
  </div>

  <div className="col-12 col-md-5">
    <input
      type="text"
      className="form-control form-control-sm"
      placeholder="Selite"
      value={item.description || ''}
      onChange={(e) => {
        const updated = [...riskidata];
        updated[
          riskidata.findIndex((i) => i.id === item.id)
        ].description = e.target.value;
        setRiskidata(updated);
      }}
    />
  </div>
</div>
        ))}
      </div>
    ))}
  </div>
)}    
        </div>
      </div>
    </div>
  ))}
</div>

<div className="flex flex-row justify-end mt-6 gap-4">
  <button className="btn btn-outline-success" onClick={handleAddCustomSection}>
    ➕ Lisää uusi osio
  </button>
  <button className="btn btn-outline-success" onClick={handleExportPdf}>
    📥 Lataa Raportti
  </button>
<button
  onClick={() => {
    const confirmClear = window.confirm('Haluatko varmasti tyhjentää raportin? Tämä poistaa kaikki tiedot.');
    if (confirmClear) resetForm();
  }}
  className="btn btn-outline-danger"
>
  ♻️ Tyhjennä kentät
</button>
</div>

         
        </div>
      </div>
    </Tab>

    <Tab eventKey="pts" title="PTS (Pitkän tähtäimen suunnitelma)">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-4">📊 PTS (Pitkän tähtäimen suunnitelma)</h3>
        <PTSLongTermTable kiinteistotunnus={kiinteistotunnus} />
      
        
      </div>
    </Tab>
<Tab eventKey="preview" title=" Raportin esikatselu">
   
  {previewUrl ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '92vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      
      <div
        style={{
          width: '80vw',
          height: '90vh',
          backgroundColor: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        
        <embed
          src={previewUrl}
          type="application/pdf"
          style={{ width: '100%', height: '100%' }}
        />
        
      </div>
      
    </div>
  ) : (
    <div className="p-4 text-muted">Ei esikatselua vielä ladattu.</div>
  )}
  <div className="mb-3">
        <button onClick={handleExportPdf} className="btn btn-outline-primary btn-sm">
          📥 Lataa Raportti
        </button>
      </div>
</Tab>


  </Tabs>
);

};

export default PropertyDetailsForm;