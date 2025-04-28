import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'handsontable/dist/handsontable.full.min.css';
import ExcelTabs from '../assets/exceltoReport';
import { Riskidataa } from '../assets/Riskidata';
import html2canvas from 'html2canvas';

const PropertyDetailsForm = ({ rakennus }) => {
  const [title, setTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const [PropertyName, setPropertyName] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [riskidata, setRiskidata] = useState(Riskidataa);
  const [sections, setSections] = useState([
    { key: 'johdanto', label: '📝 Johdanto', content: '', include: false, images: [] },
    { key: 'jarjestelma', label: '⚙️ Järjestelmäkuvaukset ja Riskiluokitus', content: '', include: false, images: [] },
    { key: 'rakennetekniikka', label: '🏗️ Rakennetekniikkan Kuvat', content: '', include: false, images: [] },
    { key: 'lvi', label: '💧 LVI-Tekniikan Kuvat', content: '', include: false, images: [] },
    { key: 'sahko', label: '⚡ Sähköjärjestelmien Kuvat', content: '', include: false, images: [] },
  ]);
  
 
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
            section.key === 'lvi' ||
            section.key === 'sahko'
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

  const drawGreenBanner = (doc, pageWidth, margin) => {
    const yPosition = 20;
    const bannerHeight = 10;

    doc.setFillColor(0, 128, 0);
    doc.rect(margin, yPosition, pageWidth - margin * 2, bannerHeight, 'F');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);

    const date = new Date().toLocaleDateString('fi-FI');
    doc.text(date, margin + 5, yPosition + 7);

    const rightText = PropertyName || 'ASUNTO OY MALLILIA';
    const rightTextWidth = doc.getTextWidth(rightText);
    doc.text(rightText, pageWidth - margin - rightTextWidth, yPosition + 7);

    doc.setTextColor(0, 0, 0);
  };

  const handleExportPdf = async () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    drawGreenBanner(doc, pageWidth, margin);
    y += 20;

    doc.setFontSize(30);
    doc.text(title || 'Raportin Otsikko', margin, y);
    y += 15;

    if (coverImage) {
      const imgWidth = 100;
      const imgHeight = imgWidth * 0.66;
      const centerX = (pageWidth - imgWidth) / 2;
      doc.addImage(coverImage, 'JPEG', centerX, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    }

    doc.setFontSize(12);
    doc.text(`Tarkastuspäivä: ${customText}`, margin, pageHeight - 20);
// 3. Kohteen Perustiedot
doc.addPage();
drawGreenBanner(doc, pageWidth, margin);

let currentYPosition = 40;
const fontSize = 12;

doc.setFontSize(20);
doc.text("Kohteen Perustiedot", margin, currentYPosition);
currentYPosition += 7;

doc.setLineWidth(0.5);
doc.line(margin, currentYPosition, pageWidth - margin, currentYPosition);
currentYPosition += 10;


doc.setFont("Helvetica", "normal");
doc.setFontSize(fontSize);

const yleistiedot = rakennus?.properties?.yleistiedot || {};
const teknisettiedot = rakennus?.properties?.teknisettiedot || {};
const allDetails = { ...yleistiedot, ...teknisettiedot };

const labelX = margin;
const valueX = pageWidth - margin;
const lineHeight = 8;
Object.entries(allDetails).forEach(([key, value], index) => {
  const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
  const formattedValue = value && typeof value === 'object' && value.value !== undefined 
    ? String(value.value) 
    : value != null 
      ? String(value) 
      : "";

  doc.text(formattedKey, labelX, currentYPosition);

  const textWidth = doc.getTextWidth(formattedValue);
  doc.text(formattedValue, valueX - textWidth, currentYPosition);

  currentYPosition += lineHeight;

  if ((index + 1) % 3 === 0) {
    doc.setLineWidth(0.2);
    doc.line(margin, currentYPosition - 4, pageWidth - margin, currentYPosition - 4);
  }

  if (currentYPosition > pageHeight - 40) {
    doc.addPage();
    drawGreenBanner(doc, pageWidth, margin);
    currentYPosition = 45;
  }
});


    for (const section of sections) {
      if (!section.include) continue;

      doc.addPage();
      drawGreenBanner(doc, pageWidth, margin);

      let ySection = 40;

      doc.setFontSize(20);
      const cleanLabel = section.label.replace(/^[^\p{L}\p{N}]+/u, '').trim();
      doc.text(cleanLabel, margin, ySection);
      ySection += 10;

      doc.setFontSize(12);
      const lines = doc.splitTextToSize(section.content, pageWidth - margin * 2);
      doc.text(lines, margin, ySection);
      ySection += lines.length * 7 + 10;

      // Add section images
      const imagesPerRow = 3;
      const imageMargin = 5;
      const imageWidth = (pageWidth - margin * 2 - (imagesPerRow - 1) * imageMargin) / imagesPerRow;
      const imageHeight = imageWidth * 1; 
      
      let imageIndex = 0;
      
      for (const imgSrc of section.images) {
        const img = new Image();
        img.src = imgSrc;
      
        await new Promise((resolve) => {
          img.onload = () => {
            const col = imageIndex % imagesPerRow;
            const row = Math.floor(imageIndex / imagesPerRow);
      
            let x = margin + col * (imageWidth + imageMargin);
            let yImage = ySection + row * (imageHeight + imageMargin);
      
            
            if (yImage + imageHeight > pageHeight - 30) {
              doc.addPage();
              drawGreenBanner(doc, pageWidth, margin);
              ySection = 40;
              imageIndex = 0; 
              x = margin;
              yImage = ySection;
            }
      
            doc.addImage(imgSrc, 'JPEG', x, yImage, imageWidth, imageHeight);
            imageIndex++;
            resolve();
          };
        });
      }

      ySection += Math.ceil(section.images.length / imagesPerRow) * (imageHeight + imageMargin) + 10;
      if (section.key === 'jarjestelma') {
        const groupedRiskidata = riskidata.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {});

        for (const [category, items] of Object.entries(groupedRiskidata)) {
          ySection += 10;
          if (ySection > pageHeight - 40) {
            doc.addPage();
            drawGreenBanner(doc, pageWidth, margin);
            ySection = 40;
          }

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(16);
          doc.text(category.toUpperCase(), margin, ySection);
          ySection += 8;

          doc.setFontSize(12);
          doc.text('Nimi', margin, ySection);
          doc.text('Riski', margin + 80, ySection);
          doc.text('Selite', margin + 130, ySection);

          ySection += 5;
          doc.setLineWidth(0.5);
          doc.line(margin, ySection, pageWidth - margin, ySection);
          ySection += 5;

          doc.setFont("Helvetica", "normal");

          for (const item of items) {
            const riskText = item.risk === 'low' ? 'Matala' : item.risk === 'medium' ? 'Keskitaso' : 'Korkea';
            const description = item.description || '';

            doc.text(item.label, margin, ySection);
            doc.text(riskText, margin + 80, ySection);
            doc.text(doc.splitTextToSize(description, pageWidth - margin - (margin + 130)), margin + 130, ySection);

            ySection += 8;
            if (ySection > pageHeight - 40) {
              doc.addPage();
              drawGreenBanner(doc, pageWidth, margin);
              ySection = 40;
            }
          }
        }
      }
    }

    
    if (hotTableRef.current) {
      const tableContainer = hotTableRef.current.hotInstance.rootElement;
      const canvas = await html2canvas(tableContainer);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);

      const pdfWidth = pageWidth - 30;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addPage();
      drawGreenBanner(doc, pageWidth, margin);
      doc.setFontSize(16);
      doc.text('PTS-ehdotukset', margin, 30);
      doc.addImage(imgData, 'PNG', 15, 40, pdfWidth, pdfHeight);
      
    }

    doc.save('report.pdf');
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

  

      {/* osiott */}
      {sections.map((section, index) => (
        <div key={section.key} className="border p-4 rounded shadow-sm">
          <div className="flex justify-between items-center mb-2">
  <div
    className="text-lg font-semibold cursor-pointer select-none"
    onClick={() => {
      const updated = [...sections];
      updated[index].include = !updated[index].include;
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

              {/* kuvan lisäys*/}
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
                    const images = files.map(file => URL.createObjectURL(file));
                    const updated = [...sections];
                    updated[index].images.push(...images);
                    setSections(updated);
                  }}
                />
              </div>
              <div

style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
  marginTop: '8px'
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
        borderRadius: '4px'
      }}
    />
    <button
      type="button"
      style={{
        position: 'absolute',
        top: '2px',
        right: '90px',
        background: '#ef4444',
        color: 'white',
        borderRadius: '9999px',
        padding: '2px 6px',
        fontSize: '10px',
        opacity: 0.75,
        border: 'none'
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



              {/* Riskidata */}
              {section.key === 'jarjestelma' && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <h4 className="text-md font-semibold mb-2">Riskidata</h4>
                  {riskidata.map((item, riskIndex) => (
                    <div key={item.id} className="flex gap-4 items-center mb-2">
                      <select
                        className="py-1 rounded text-sm w-1/3"
                        value={item.risk}
                        onChange={(e) => {
                          const updated = [...riskidata];
                          updated[riskIndex].risk = e.target.value;
                          setRiskidata(updated);
                        }}
                      >
                        <option value="low">✅ Matala riski</option>
                        <option value="medium">🟡 Keskitason riski</option>
                        <option value="high">🔴 Korkea riski</option>
                      </select>
                      <input
                        type="text"
                        className="form-input border px-2 py-1 rounded text-sm w-2/3"
                        placeholder="Kirjoita selite..."
                        value={item.description || ''}
                        onChange={(e) => {
                          const updated = [...riskidata];
                          updated[riskIndex].description = e.target.value;
                          setRiskidata(updated);
                        }}
                      />
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
      <div className="border p-4 rounded shadow-sm">
        <ExcelTabs ref={hotTableRef} />
      </div>
      <div className="flex justify-center mt-6">
        <button onClick={handleExportPdf} className="btn btn-primary">
          Lataa Raportti
        </button>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;
