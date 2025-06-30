import React, { useState, useRef } from 'react';
import 'handsontable/dist/handsontable.full.min.css';
import ExcelTabs from '../assets/exceltoReport';
import { Riskidataa } from '../assets/Riskidata';
import html2canvas from 'html2canvas';
import { useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake'
import '../fonts/josefin-fonts.js';
import'../fonts/Lato-fonts.js';
import Select from 'react-select';
import JohdantoText from '../Static/johdando';
import Jarjestelmakuvaus from '../Static/Jarjestelmariskikuvaus';


const PropertyDetailsForm = ({ rakennus }) => {
  const savedData = JSON.parse(localStorage.getItem('reportFormData')) || {};

  const [title, setTitle] = useState(savedData.title || '');
  const [customText, setCustomText] = useState(savedData.customText || '');
  const [rakennusData, setRakennusData] = useState(rakennus);
  const [PropertyName, setPropertyName] = useState(savedData.PropertyName || '');
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null);
  const [riskidata, setRiskidata] = useState(savedData.riskidata || Riskidataa);


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






 const handleExportPdf = async () => {
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
      : {},
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

  // ➡️ Insert Sisällysluettelo (TOC) only once after Johdanto
  content.push({
    text: 'SISÄLLYSLUETTELO',
    style: 'heading',
    pageBreak: 'before',
    margin: [0, 20, 0, 10],
  });

  let pageCounter = 3; // Adjust as needed

  // ➡️ Include Johdanto in TOC
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

  // ➡️ Add remaining sections to TOC
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

  // ➡️ Render remaining sections after TOC
  for (const section of sections) {
    if (!section.include || section.key === 'johdanto') continue;

    content.push(
      { text: section.label.toUpperCase(), style: 'sectionTitle', pageBreak: 'before', margin: [0, 10, 0, 5] }
    );

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

      content.push(...imageRows);
      content.push({ text: '', margin: [0, 10] });
    }

    // ➡️ If Jarjestelma section, render riskidata
    if (section.key === 'jarjestelma') {
      content.push(
        { text: '     Riskiluokitus', fontSize: 14, semibold: true, margin: [0, 10, 0, 10] },
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
        content.push(
          { text: category.toUpperCase(), fontSize: 14, semibold: true, margin: [0, 10, 0, 5] },
          {
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: '#008000' },
            ],
            margin: [0, 0, 0, 5],
          }
        );

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
          table: { widths: ['30%', '70%'], body: tableBody },
          layout: tableLayout,
          margin: [0, 0, 0, 10],
        });
      }
    }
  }

  // ➡️ Render Handsontable screenshot if exists
  if (hotTableRef.current) {
    const tableContainer = hotTableRef.current.hotInstance.rootElement;
    const canvas = await html2canvas(tableContainer);
    const imgData = canvas.toDataURL('image/png');
    content.push(
      { text: 'PTS-ehdotukset', fontSize: 16, semibold: true, margin: [0, 20, 0, 10] },
      { image: imgData, width: 500 }
    );
  }

  // ➡️ Create PDF
  pdfMake.createPdf({
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
  }).download(`${templates[selectedTemplate].name}_${PropertyName || 'Kohde'}.pdf`);

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
    <div className="mb-4">
  <label className="font-semibold text-sm">Valitse raporttipohja:</label>
  <select
    className="form-select mt-1"
    value={selectedTemplate}
    onChange={(e) => {
      const newKey = e.target.value;
      setSelectedTemplate(newKey);
      setSections(templates[newKey].defaultSections); // Replace sections with selected template
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
  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
    🏡 Kohteen Perustiedot <span className="text-sm text-gray-500"></span>
  </h3>

  {/* Yleistiedot */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Object.entries(rakennusData?.properties?.yleistiedot || {}).map(([key, value]) => (
      <div key={key} className="flex flex-col">
        <label className="text-sm font-medium mb-1 capitalize">
          {key.replace(/([A-Z])/g, ' $1')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="form-input border px-2 py-1 rounded text-sm flex-1"
            value={typeof value === 'object' && value !== null ? value.value || '' : value || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setRakennusData((prev) => {
                const updated = { ...prev };
                if (!updated.properties) updated.properties = {};
                if (!updated.properties.yleistiedot) updated.properties.yleistiedot = {};
                const existing = updated.properties.yleistiedot[key] || {};
                updated.properties.yleistiedot[key] = { ...existing, value: newValue };
                return updated;
              });
            }}
          />
          <input
            type="text"
            placeholder="Lähde"
            className="form-input border px-2 py-1 rounded text-sm w-24"
            value={typeof value === 'object' && value !== null ? value.source || '' : ''}
            onChange={(e) => {
              const newSource = e.target.value;
              setRakennusData((prev) => {
                const updated = { ...prev };
                if (!updated.properties) updated.properties = {};
                if (!updated.properties.yleistiedot) updated.properties.yleistiedot = {};
                const existing = updated.properties.yleistiedot[key] || {};
                updated.properties.yleistiedot[key] = { ...existing, source: newSource };
                return updated;
              });
            }}
          />
        </div>
      </div>
    ))}

    {/* Tekniset tiedot */}
    {Object.entries(rakennusData?.properties?.teknisettiedot || {}).map(([key, value]) => (
      <div key={key} className="flex flex-col">
        <label className="text-sm font-medium mb-1 capitalize">
          {key.replace(/([A-Z])/g, ' $1')}
        </label>
        <div className="flex gap-2">
          
          <input
            type="text"
            className="form-input border px-2 py-1 rounded text-sm flex-1"
            value={typeof value === 'object' && value !== null ? value.value || value : value || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setRakennusData((prev) => {
                const updated = { ...prev };
                
                if (!updated.properties) updated.properties = {};
                if (!updated.properties.teknisettiedot) updated.properties.teknisettiedot = {};
                const existing = updated.properties.teknisettiedot[key] || {};
                updated.properties.teknisettiedot[key] = { ...existing, value: newValue };
                return updated;
              });
            }}
          />
          <input
            type="text"
            placeholder="Lähde"
            className="form-input border px-2 py-1 rounded text-sm w-24"
            value={typeof value === 'object' && value !== null ? value.source || '' : ''}
            onChange={(e) => {
              const newSource = e.target.value;
              setRakennusData((prev) => {
                const updated = { ...prev };
                if (!updated.properties) updated.properties = {};
                if (!updated.properties.teknisettiedot) updated.properties.teknisettiedot = {};
                const existing = updated.properties.teknisettiedot[key] || {};
                updated.properties.teknisettiedot[key] = { ...existing, source: newSource };
                return updated;
              });
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>



  

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

        {/* Image upload for 'kuvat' sections */}
        {(section.key.toLowerCase().includes('kuvat') || section.label.toLowerCase().includes('kuvat')) && (
          <>
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => document.getElementById(`file-${section.key}`).click()}
              >
                ➕ Lisää kuva
              </button>
              <input
                type="file"
                id={`file-${section.key}`}
                accept="image/*"
                style={{ display: 'none' }}
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const convertToBase64 = (file) =>
                    new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });

                  Promise.all(files.map(convertToBase64)).then((base64Images) => {
                    const updated = [...sections];
                    updated[index].images.push(...base64Images);
                    setSections(updated);
                  });
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              {section.images.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img
                    src={img}
                    alt="Section"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '9999px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      opacity: 0.75,
                      border: 'none',
                    }}
                    onClick={() => {
                      const updated = [...sections];
                      updated[index].images = updated[index].images.filter((_, imgIndex) => imgIndex !== i);
                      setSections(updated);
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

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
      {/* Excel */}
      <div className="flex justify-center mt-6">
        <button onClick={handleExportPdf} className="btn btn-primary">
          Lataa Raportti
        </button>
      </div>
    </div>
    </div>
  );
};

export default PropertyDetailsForm;
