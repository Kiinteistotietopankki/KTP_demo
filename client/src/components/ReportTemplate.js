import React, { useState, useRef } from 'react';
import 'handsontable/dist/handsontable.full.min.css';
import { Riskidataa } from '../assets/Riskidata';
import { useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake'
import '../fonts/josefin-fonts.js';
import'../fonts/Lato-fonts.js';

import JohdantoText from '../Static/johdando';
import Jarjestelmakuvaus from '../Static/Jarjestelmariskikuvaus';
import PTSLongTermTable from './PTS/PTSLongTermTable.js';
import { Tab, Tabs } from 'react-bootstrap';
import ImageUploadCategorizer from './ImageUpload.js';


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
  
  const [PropertyName, setPropertyName] = useState(savedData.PropertyName || '');
  const [propertyId, setPropertyId] = useState(kiinteistotunnus);
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null);
  const [riskidata, setRiskidata] = useState(savedData.riskidata || Riskidataa);
const [previewUrl, setPreviewUrl] = useState(null);
const [showPreviewModal, setShowPreviewModal] = useState(false);
const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%

// raporttipohjat
const templates = {
  wpts: {
    name: 'W-PTS Katselmus',
    defaultSections: [
      { key: 'kohteenkuvat', label: '📷 Ota kuvia kohteesta'},
      { key: 'johdanto', label: '📝 Johdanto', content: JohdantoText.Option1, include: true, images: [] },
      { key: 'jarjestelma', label: '⚙️ Järjestelmäkuvaukset ja Riskiluokitus', content: Jarjestelmakuvaus.option1, include: true, images: [] },
      { key: 'rakennetekniikka', label: '🏗️ Rakennetekniikkan Kuvat', content: '', include: false, images: [] },
      { key: 'lvi', label: '💧 LVI-Tekniikan Kuvat', content: '', include: false, images: [] },
      { key: 'sahko', label: '⚡ Sähköjärjestelmien Kuvat', content: '', include: false, images: [] },
      { key: 'lähtötiedot', label: 'Lähtötiedot', content: '', include: false, images: [] },
      { key: 'havainnot', label: 'Merkittävimmät havainnot', content: '', include: false, images: [] },
      { key: 'allekirjoitus', label: 'Allekirjoitukset', content: '', include: false, images: [] },
    ]
  },

  wk1: {
    name: 'Kuntoarvio WK1',
    defaultSections: [
      { key: 'kohteenkuvat', label: '📷 Ota kuvia kohteesta'},
      { key: 'johdanto', label: '📘 Yleiskuvaus', content: '', include: true, images: [] },
      { key: 'kuntoarvio', label: '🔎 Kuntoarviointi', content: '', include: true, images: [] },
      { key: 'riskit', label: '⚠️ Riskit ja Huomiot', content: '', include: true, images: [] },
      { key: 'toimenpide', label: '🛠️ Suositellut Toimenpiteet', content: '', include: true, images: [] },
      { key: 'allekirjoitus', label: '✍️ Allekirjoitukset', content: '', include: true, images: [] },
    ]
  },
    Markatila: {
    name: 'Märkätila WK1',
    defaultSections: [
      { key: 'kohteenkuvat', label: '📷 Ota kuvia kohteesta'},
      { key: 'johdanto', label: '📘 Yleiskuvaus', content: '', include: true, images: [] },
      { key: 'kuntoarvio', label: '🔎 Kuntoarviointi', content: '', include: true, images: [] },
      { key: 'riskit', label: '⚠️ Riskit ja Huomiot', content: '', include: true, images: [] },
      { key: 'toimenpide', label: '🛠️ Suositellut Toimenpiteet', content: '', include: true, images: [] },
      { key: 'allekirjoitus', label: '✍️ Allekirjoitukset', content: '', include: true, images: [] },
    ]
  },
    wk3: {
    name: 'Kuntoarvio WK3',
    defaultSections: [
      { key: 'kohteenkuvat', label: '📷 Ota kuvia kohteesta'},
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
    setTitle('');
    setCustomText('');
    setPropertyName('');
    setCoverImage(null);
    setRiskidata(Riskidataa);
    setSections([
      { key: 'johdanto', label: '📝 Johdanto', content: '', include: false, images: [] },
      { key: 'jarjestelma', label: '⚙️ Järjestelmäkuvaukset ja Riskiluokitus', content: '', include: false, images: [] },
      { key: 'kohteenkuvat', label: 'Kohteen Kuvat', content: '', include: false, images: [] },
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
        if (previewUrl) URL.revokeObjectURL(previewUrl); // cleanup
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
  content.push(
    { text: title || 'Raportin Otsikko', style: 'title', margin: [0, 60, 0, 20] },
    coverImage
      ? {
          image: coverImage,
          width: 300,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        }
      : null,
    { text: `Tarkastuspäivämäärä: ${customText}`, fontSize: 12, margin: [0, 550, 0, 40] }
  );


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

  rakennukset.forEach((rak) => {
    const dataRows = [
      ['Osoite', `${rak.osoite}, ${rak.postinumero} ${rak.toimipaikka}`],
      ['Rakennustunnus', rak.rakennustunnus],
      ['Rakennusvuosi', rak.rakennusvuosi],
      ['Koordinaatti sijainti', rak.sijainti ? `${rak.sijainti.coordinates[1]}, ${rak.sijainti.coordinates[0]}` : '-'],
      ['Rakennusluokitus', rak.rakennusluokitus],
      ['Runkotapa', rak.runkotapa],
      ['Käyttötilanne', rak.kayttotilanne],
      ['Julkisivumateriaali', rak.julkisivumateriaali],
      ['Lämmitystapa', rak.lammitystapa],
      ['Energialähde', rak.lammitysenergialahde],
      ['Rakennusaine', rak.rakennusaine],
      ['Tilavuus', rak.tilavuus],
      ['Kokonaisala', rak.kokonaisala],
      ['Kerrosala', rak.kerrosala],
      ['Huoneistoala', rak.huoneistoala],
      ['Kerroksia', rak.kerroksia],
    ];

    const tableBody = dataRows.map(([label, value]) => [
      { text: label, bold: true, fontSize: 11 },
      { text: value || '-', fontSize: 11 }
    ]);

    content.push({
      table: {
        widths: ['30%', '70%'],
        body: tableBody
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10]
    });
  });
}
 




  content.push({
    text: 'SISÄLLYSLUETTELO',
    style: 'heading',
    pageBreak: 'before',
    margin: [0, 20, 0, 10],
  });

  let pageCounter = 3;
  let tocIndex = 1;



  sections.forEach((section) => {
  if (section.include) {
      const label = section.label.replace(/^(\W*\s*)/, '');
      content.push({
        columns: [
          { text: `${tocIndex++}. ${label}`, style: 'paragraph', margin: [0, 2] },
          { text: `${pageCounter++}`, alignment: 'right', style: 'paragraph', margin: [0, 2] },
        ],
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
      const imagesPerRow = 3;
      const imageRows = [];

      for (let i = 0; i < section.images.length; i += imagesPerRow) {
 const rowImages = section.images.slice(i, i + imagesPerRow).map((img) => ({
  stack: [
    {
      image: img.url,
      width: 160,
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
            setSelectedTemplate(newKey);
            setSections(templates[newKey].defaultSections);
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
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Raportin otsikko"
              className="form-control mb-3"
            />
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
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Tarkastuspäivämäärä"
              className="form-control"
            />
          </div>

<div className="border p-4 rounded shadow-sm">
  <h3 className="text-xl font-semibold mb-4">🏠 Kohteen tiedot</h3>

  {rakennusData?.rakennukset_fulls?.map((rak, idx) => (
    <div key={idx} className="mb-5">
      <h5 className="fw-bold text-primary mb-3">
        {rak.osoite}, {rak.postinumero} {rak.toimipaikka}
      </h5>

      <div className="row">
        {[
          ['Toimipaikka', 'toimipaikka'],
          ['Rakennustunnus', 'rakennustunnus'],
          ['Rakennusvuosi', 'rakennusvuosi'],
          ['Sijainti', null, `${rak.sijainti?.coordinates[1]}, ${rak.sijainti?.coordinates[0]}`],
          ['Rakennusluokitus', 'rakennusluokitus'],
          ['Runkotapa', 'runkotapa'],
          ['Käyttötilanne', 'kayttotilanne'],
          ['Julkisivumateriaali', 'julkisivumateriaali'],
          ['Lämmitystapa', 'lammitystapa'],
          ['Energialähde', 'lammitysenergialahde'],
          ['Rakennusaine', 'rakennusaine'],
          ['Kokonaisala', 'kokonaisala'],
          ['Kerrosala', 'kerrosala'],
          ['Huoneistoala', 'huoneistoala'],
          ['Tilavuus', 'tilavuus'],
          ['Kerroksia', 'kerroksia'],
        ].map(([label, key, customValue], i) => {
          const value = customValue ?? rak[key] ?? '-';
          const source = key ? rak.metadata?.[key]?.source ?? 'Ympäristö.fi-RYHTI' : 'Ympäristö.fi-RYHTI';

          return (
            <div key={i} className="col-md-6 mb-3">
              <p className="mb-1"><strong>{label}</strong></p>
              <p className="mb-0">{value}</p>
              <small className="text-muted">Lähde: {source}</small>
            </div>
          );
        })}
      </div>
    </div>
  ))}
</div>



          
          <div className="accordion my-4" id="templateAccordion">
  {sections.map((section, index) => (
    <div className="accordion-item" key={section.key}>
      <h2 className="accordion-header" id={`template-heading-${index}`}>
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
              <h4 className="text-md fw-semibold mb-3">Riskitaulu</h4>
  {riskidata.map((item, riskIndex) => (
  <div
    key={item.id}
    className="d-flex align-items-center mb-2"
    style={{ gap: '1rem' }}
  >
    <div style={{ width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <strong>{item.label}</strong>
    </div>

    <div
      style={{
        width: '30px',
        textAlign: 'center',
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
    </div>

    <div style={{ width: '160px' }}>
      <select
        className="form-select form-select-sm"
        value={item.risk}
        onChange={(e) => {
          const updated = [...riskidata];
          updated[riskIndex].risk = e.target.value;
          setRiskidata(updated);
        }}
      >
        <option value="low">Matala riski</option>
        <option value="medium">Keskitason riski</option>
        <option value="high">Korkea riski</option>
      </select>
    </div>

    <input
      type="text"
      className="form-control form-control-sm"
      placeholder="Selite"
      value={item.description || ''}
      onChange={(e) => {
        const updated = [...riskidata];
        updated[riskIndex].description = e.target.value;
        setRiskidata(updated);
      }}
      style={{ flex: 1, minWidth: '200px' }}
    />
  </div>
))}

            </div>
          )}
        </div>
      </div>
    </div>
  ))}
</div>


          <button onClick={handleAddCustomSection} className="btn btn-outline-primary">
            ➕ Lisää uusi osio
          </button>

          <div className="flex justify-center mt-6 gap-4">
            <button onClick={handleExportPdf} className="btn btn-primary">
              Lataa Raportti
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