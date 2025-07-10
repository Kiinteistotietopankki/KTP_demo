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
import LVITable from './PTS/LVItaulu.js';
import SähkötekniikkaTable from './PTS/Sähkötekniikkataulu.js';
import { Tab, Tabs } from 'react-bootstrap';


const PropertyDetailsForm = ({ rakennus }) => {
  const savedData = JSON.parse(localStorage.getItem('reportFormData')) || {};

  const [title, setTitle] = useState(savedData.title || '');
  const [customText, setCustomText] = useState(savedData.customText || '');
  const [rakennusData, setRakennusData] = useState(rakennus);
  const [PropertyName, setPropertyName] = useState(savedData.PropertyName || '');
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null);
  const [riskidata, setRiskidata] = useState(savedData.riskidata || Riskidataa);
const [previewUrl, setPreviewUrl] = useState(null);
const [showPreviewModal, setShowPreviewModal] = useState(false);

// raporttipohjat
const templates = {
  wpts: {
    name: 'W-PTS Katselmus',
    defaultSections: [
      { key: 'johdanto', label: '📝 Johdanto', content: JohdantoText.Option1, include: true, images: [] },
      { key: 'jarjestelma', label: '⚙️ Järjestelmäkuvaukset ja Riskiluokitus', content: Jarjestelmakuvaus.option1, include: true, images: [] },
      { key: 'kuvat', label: 'Kohteen kuvat', content: '', include: false, images: [] },
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
      { key: 'rakennetekniikka', label: '🏗️ Rakennetekniikkan Kuvat', content: '', include: false, images: [] },
      { key: 'kohteenkuvat', label: 'Kohteenkuvat Kuvat', content: '', include: false, images: [] },
      { key: 'lvi', label: '💧 LVI-Tekniikan Kuvat', content: '', include: false, images: [] },
      { key: 'sahko', label: '⚡ Sähköjärjestelmien Kuvat', content: '', include: false, images: [] },
      { key: 'lähtötiedot', label: 'Lähtötiedot', content: '', include: false, images: [] },
    { key: 'havainnot', label: ' Merkittävimmät havainnot ', content: '', include: false, images: [] },
    { key: 'allekirjoitus', label: ' Allekirjoitukset', content: '', include: false, images: [] },
    ]);
    localStorage.removeItem('reportFormData');
  };


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
  const formData = {
    title,
    customText,
    PropertyName,
    coverImage,
    riskidata,
    sections,
    selectedTemplate,
  };
  localStorage.setItem('reportFormData', JSON.stringify(formData));
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

  // ➡️ Cover page
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
    { text: `Tarkastuspäivämäärä: ${customText}`, fontSize: 12, margin: [0, 0, 0, 40] }
  );

  // ➡️ Kohteen perustiedot
  const yleistiedot = rakennusData?.properties?.yleistiedot || {};
  const teknisettiedot = rakennusData?.properties?.teknisettiedot || {};
  const allDetails = { ...yleistiedot, ...teknisettiedot };

  content.push({ text: 'Kohteen Perustiedot', style: 'heading', pageBreak: 'before', margin: [0, 20, 0, 10] });

  const detailsTable = Object.entries(allDetails).map(([key, value]) => {
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
    let formattedValue = '';
    let source = '-';
    if (typeof value === 'object' && value !== null) {
      formattedValue = value.value || '';
      source = value.source || '-';
    } else {
      formattedValue = value || '';
    }
    return [formattedKey, formattedValue, source];
  });

  if (detailsTable.length) {
    content.push({
      table: {
        widths: ['*', '*', '*'],
        body: [['Kenttä', 'Arvo', 'Lähde'], ...detailsTable],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 20],
    });
  }

  // ➡️ Render Johdanto first (if included)
  const johdantoSection = sections.find((s) => s.key === 'johdanto' && s.include);
  if (johdantoSection) {
    content.push(
      { text: johdantoSection.label.toUpperCase(), style: 'sectionTitle', pageBreak: 'before', margin: [0, 10, 0, 5] },
      { text: johdantoSection.content, style: 'paragraph', margin: [0, 0, 0, 10] }
    );
  }

  // ➡️ Insert Sisällysluettelo (TOC)
  content.push({
    text: 'SISÄLLYSLUETTELO',
    style: 'heading',
    pageBreak: 'before',
    margin: [0, 20, 0, 10],
  });

  let pageCounter = 3;
  let tocIndex = 1;

  if (johdantoSection) {
    const label = johdantoSection.label.replace(/^(\W*\s*)/, '');
    content.push({
      columns: [
        { text: `${tocIndex++}. ${label}`, style: 'paragraph', margin: [0, 2] },
        { text: `${pageCounter++}`, alignment: 'right', style: 'paragraph', margin: [0, 2] },
      ],
    });
  }

  sections.forEach((section) => {
    if (section.include && section.key !== 'johdanto') {
      const label = section.label.replace(/^(\W*\s*)/, '');
      content.push({
        columns: [
          { text: `${tocIndex++}. ${label}`, style: 'paragraph', margin: [0, 2] },
          { text: `${pageCounter++}`, alignment: 'right', style: 'paragraph', margin: [0, 2] },
        ],
      });
    }
  });

  // ➡️ Render remaining sections with only first page break
  let first = true;
  for (const section of sections) {
    if (!section.include) continue;

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
          image: img,
          width: 160,
          margin: [5, 5, 5, 5],
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
      margin: [0, 2, 0, 0] // reduced bottom margin from 2 to 0
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
      margin: [0, 2, 0, 2] // reduced top and bottom margin
    },
    {
      table: { widths: ['30%', '70%'], body: tableBody },
      layout: tableLayout,
      margin: [0, 0, 0, 4] // reduced bottom spacing for next block
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

const handlePreviewPdf = async () => {
  const docDefinition = await buildPdfContent();
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  pdfDocGenerator.getBlob((blob) => {
    const blobUrl = URL.createObjectURL(blob);
    setPreviewUrl(blobUrl);
    setShowPreviewModal(true);
  });
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
  <Tabs defaultActiveKey="report" id="report-tabs" className="mb-3">
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

          {/* MAP SECTIONS */}
          {sections.map((section, index) => (
            <div key={section.key} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div
                  className="text-lg font-semibold cursor-pointer select-none"
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
                  {section.label} {section.include ? '▼' : '▶️'}
                </div>
              </div>

              {section.include && (
                <>
                  <textarea
                    className="form-control mt-2"
                    rows="10"
                    value={section.content}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[index].content = e.target.value;
                      setSections(updated);
                    }}
                  />

                  {/* Risk table for jarjestelma */}
                  {section.key === 'jarjestelma' && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-md font-semibold mb-2">Riskitaulu</h4>
                      {riskidata.map((item, riskIndex) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 border-b border-gray-300 pb-2"
                        >
                          <div className="w-1/4 font-semibold">{item.label}</div>
                          <div className="flex items-center gap-3 flex-1">
                            <span
                              style={{
                                color:
                                  item.risk === 'low'
                                    ? 'green'
                                    : item.risk === 'medium'
                                    ? 'orange'
                                    : 'red',
                                fontSize: '1.2rem',
                              }}
                            >
                              √
                            </span>

                            <select
                              className="form-input border px-2 py-1 rounded text-sm w-32 text-center"
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

                            <input
                              type="text"
                              className="form-input border px-2 py-1 rounded text-sm flex-1"
                              placeholder="Kirjoita selite..."
                              value={item.description || ''}
                              onChange={(e) => {
                                const updated = [...riskidata];
                                updated[riskIndex].description = e.target.value;
                                setRiskidata(updated);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <button onClick={handleAddCustomSection} className="btn btn-outline-primary">
            ➕ Lisää uusi osio
          </button>

          <div className="flex justify-center mt-6 gap-4">
            <button onClick={handlePreviewPdf} className="btn btn-secondary">
              Esikatsele Raportti
            </button>
            <button onClick={handleExportPdf} className="btn btn-primary">
              Lataa Raportti
            </button>
          </div>

          {showPreviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="bg-white p-2 rounded shadow-md w-[90vw] h-[90vh] relative">
                <button
                  className="absolute top-2 right-2 text-black bg-gray-200 rounded px-2 py-1"
                  onClick={() => {
                    URL.revokeObjectURL(previewUrl);
                    setShowPreviewModal(false);
                  }}
                >
                  ❌ Close
                </button>
                <embed src={previewUrl} type="application/pdf" className="w-full h-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Tab>

    <Tab eventKey="pts" title="PTS (Pitkän tähtäimen suunnitelma)">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-4">📊 PTS (Pitkän tähtäimen suunnitelma)</h3>
        <PTSLongTermTable />
        <LVITable/>
        <SähkötekniikkaTable />
      </div>
    </Tab>
  </Tabs>
);

};

export default PropertyDetailsForm;
