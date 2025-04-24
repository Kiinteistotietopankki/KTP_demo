import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Riskidataa } from '../assets/Riskidata';

const loadStateFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const PropertyDetailsForm = ({ rakennus }) => {
  const [title, setTitle] = useState(() => loadStateFromLocalStorage('title', ''));
  const [customText, setCustomText] = useState(() => loadStateFromLocalStorage('customText', ''));
  const [johdantoText, setJohdantoText] = useState(() => loadStateFromLocalStorage('johdantoText', ''));
  const [jarjestelmaText, setJarjestelmaText] = useState(() => loadStateFromLocalStorage('jarjestelmaText', ''));
  const [RakennetekniikkaText, setRakennetekniikkaText] = useState(() => loadStateFromLocalStorage('RakennetekniikkaText', ''));
  const [SähköjärjestelmäText, setSähköjärjestelmäText] = useState(() => loadStateFromLocalStorage('SähköjärjestelmäText', ''));
  const [images, setImages] = useState([]); 
  const [LVIText, setLVIText] = useState(() => loadStateFromLocalStorage('LVIText', ''));
  const [PropertyName, setPropertyName] = useState(() => loadStateFromLocalStorage('PropertyName', ''));
  const [riskidata, setRiskidata] = useState(() => loadStateFromLocalStorage('riskidata', Riskidataa));
  const [imagesByCategory, setImagesByCategory] = useState(() => loadStateFromLocalStorage('imagesByCategory', {
    'LVI-laitteet': [],
    'Sähkölaitteet': [],
    'Rakenteet': [],
  }));
  const [coverImage, setCoverImage] = useState(() => loadStateFromLocalStorage('coverImage', null));

  useEffect(() => { localStorage.setItem('title', JSON.stringify(title)); }, [title]);
  useEffect(() => { localStorage.setItem('customText', JSON.stringify(customText)); }, [customText]);
  useEffect(() => { localStorage.setItem('johdantoText', JSON.stringify(johdantoText)); }, [johdantoText]);
  useEffect(() => { localStorage.setItem('jarjestelmaText', JSON.stringify(jarjestelmaText)); }, [jarjestelmaText]);
  useEffect(() => { localStorage.setItem('RakennetekniikkaText', JSON.stringify(RakennetekniikkaText)); }, [RakennetekniikkaText]);
  useEffect(() => { localStorage.setItem('SähköjärjestelmäText', JSON.stringify(SähköjärjestelmäText)); }, [SähköjärjestelmäText]);
  useEffect(() => { localStorage.setItem('LVIText', JSON.stringify(LVIText)); }, [LVIText]);
  useEffect(() => { localStorage.setItem('PropertyName', JSON.stringify(PropertyName)); }, [PropertyName]);
  useEffect(() => { localStorage.setItem('riskidata', JSON.stringify(riskidata)); }, [riskidata]);
  useEffect(() => { localStorage.setItem('imagesByCategory', JSON.stringify(imagesByCategory)); }, [imagesByCategory]);
  useEffect(() => { localStorage.setItem('coverImage', JSON.stringify(coverImage)); }, [coverImage]);

  // Handle multiple image file uploads
  const handleCategoryImageUpload = (e, category) => {
    const files = Array.from(e.target.files);
    const readers = [];
  
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesByCategory((prev) => ({
          ...prev,
          [category]: [...prev[category], reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };
  



  const drawGreenLineWithDate = (doc, title = '') => {
    const yPosition = 20;
    const bannerHeight = 10;

    doc.setFillColor(0, 128, 0);
    doc.rect(15, yPosition, 180, bannerHeight, 'F');
    doc.setFont("Dotum", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);

    const date = new Date().toLocaleDateString('fi-FI');
    doc.text(date, 20, yPosition + 7);

    const rightText = PropertyName || "ASUNTO OY MALLILIA";
    const textWidth = doc.getTextWidth(rightText);
    const rightX = 200 - textWidth - 15;
    doc.text(rightText, rightX, yPosition + 7);

    doc.setTextColor(0, 0, 0);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const margin = 15;
    const fontSize = 12;
    const headingFontSize = 30;
    const pageHeaderSize =17;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.getWidth();

    let currentYPosition = 20;

    const insertImagesByCategory = (doc, images, yStart, title) => {
      let y = yStart;
      const maxImageWidth = 180;
      const maxImageHeight = 100;
    
      if (images.length === 0) return y;
    
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Sähkölaitteet" , 15, y);
      y += 5;
    
      images.forEach((imgSrc, index) => {
        doc.addImage(imgSrc, 'JPEG', 15, y, maxImageWidth, maxImageHeight);
        y += maxImageHeight + 10;
    
        // Add page if overflow
        if (y > doc.internal.pageSize.height - 40) {
          doc.addPage();
          drawGreenLineWithDate(doc);
          y = 45;
        }
      });
    
      return y;
    };
    
    const renderRiskSection = (doc, sectionTitle, items, startY, margin) => {
      let y = startY;
    
      // Section Heading
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text(sectionTitle, margin, y);
      y += 8;
    
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
    
      items.forEach(item => {
        const label = item.label;
        const description = item.description || "";
        const icon = "✓";
    
        let color = [0, 128, 0];
        if (item.risk === "medium") color = [255, 165, 0];
        if (item.risk === "high") color = [255, 0, 0];
    
  
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(label, margin, y);
    
       
        doc.setTextColor(...color);
        doc.setFont("Helvetica", "bold");
        doc.text(icon, margin + 70, y);
    
        
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(description, margin + 80, y, { maxWidth: 100 });
    
        y += 10;
    
        // Page break
        if (y > pageHeight - 30) {
          doc.addPage();
          drawGreenLineWithDate(doc);
          y = 45;
        }
      });
    
      return y + 5; 
    };
    

    
    drawGreenLineWithDate(doc);
    currentYPosition = 45;

    // Title Section
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(headingFontSize);
    doc.text(title || "Raportin otsikko", margin, currentYPosition);
    currentYPosition += 15; 
    if (coverImage) {
      const imgWidth = 100; // You can adjust this, maybe 80–120
      const imgHeight = imgWidth * 0.66; // Maintain aspect ratio (adjust as needed)
      const centerX = (pageWidth - imgWidth) / 2; // Center the image
    
      doc.addImage(coverImage, 'JPEG', centerX, currentYPosition, imgWidth, imgHeight, '', 'FAST');
      currentYPosition += imgHeight + 10;
    }

    // Custom Text Section
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(fontSize);
    const customTextY = pageHeight - 40; 
    doc.text(`Tarkastuspäivä: ${customText}`, margin, customTextY, { maxWidth: 180 });
    doc.addPage();
    drawGreenLineWithDate(doc);
    currentYPosition = 45;
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(pageHeaderSize);
    doc.text("2. Johdanto", margin, currentYPosition);
    currentYPosition += 10;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.text(johdantoText || '', margin, currentYPosition, { maxWidth: 180 });
    currentYPosition += 20;
    // Add a page for the TOC
    doc.addPage();
    drawGreenLineWithDate(doc);
    currentYPosition = 45;

    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(pageHeaderSize);
    doc.text("Sisällysluettelo", margin, currentYPosition);
    currentYPosition += 10;
    doc.addPage();
    drawGreenLineWithDate(doc);
    currentYPosition = 45;
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(pageHeaderSize);
    doc.text("3. Kohteen Perustiedot", margin, currentYPosition);
    currentYPosition += 7;
    
    
    doc.setLineWidth(0.5);
    doc.line(margin, currentYPosition, pageWidth - margin, currentYPosition);
    currentYPosition += 10;
    
    // Prepare data
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(fontSize);
    
    const yleistiedot = rakennus?.properties?.yleistiedot || {};
    const teknisettiedot = rakennus?.properties?.teknisettiedot || {};
    const allDetails = { ...yleistiedot, ...teknisettiedot };
    
    const labelX = margin;
    const valueX = pageWidth - margin; 
    const lineHeight = 8;
    
    Object.entries(allDetails).forEach(([key, value], index) => {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize
      const formattedValue = value != null ? String(value) : "";
    
      doc.setFont("Helvetica", "normal");
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
        drawGreenLineWithDate(doc);
        currentYPosition = 45;
      }
    });
    
    
    // Section 4 - Järjestelmäkuvaukset ja Riskiluokitus
    doc.addPage();
    drawGreenLineWithDate(doc);
    currentYPosition = 45;
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(pageHeaderSize);
    doc.text("4. Järjestelmäkuvaukset ja Riskiluokitus", margin, currentYPosition);
    currentYPosition += 10;
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.text(jarjestelmaText || '', margin, currentYPosition, { maxWidth: 180 });
    currentYPosition += 20;
    
    
const groupedRiskidata = riskidata.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {});


Object.entries(groupedRiskidata).forEach(([category, items]) => {
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(pageHeaderSize);
  doc.text(category.toUpperCase(), margin, currentYPosition);
  currentYPosition += 8;

  // Draw horizontal line under the header
  doc.setLineWidth(0.5);
  doc.line(margin, currentYPosition, 195, currentYPosition);
  currentYPosition += 5;

  
  doc.setFontSize(10);
  doc.setFont("Helvetica", "bold");
  doc.text("Nimi", margin, currentYPosition);
  doc.text("Riski", margin + 80, currentYPosition);
  doc.text("Selite", margin + 120, currentYPosition);
  currentYPosition += 6;

  
  doc.setLineWidth(0.2);
  doc.line(margin, currentYPosition, 195, currentYPosition);
  currentYPosition += 5;

  
  doc.setFont("Helvetica", "normal");
  items.forEach((item) => {
    const riskLevelText =
      item.risk === 'low' ? 'Matala riski' :
      item.risk === 'medium' ? 'Keskitason riski' :
      item.risk === 'high' ? 'Korkea riski' : '';

    const description = item.description || '';

   
    const descLines = doc.splitTextToSize(description, 65);
    const lineCount = Math.max(1, descLines.length);

    
    doc.text(item.label, margin, currentYPosition);
    doc.text(riskLevelText, margin + 80, currentYPosition);
    doc.text(descLines[0], margin + 120, currentYPosition);

    // Additional lines of description
    for (let i = 1; i < descLines.length; i++) {
      currentYPosition += 5;
      doc.text(descLines[i], margin + 120, currentYPosition);
    }

    currentYPosition += 8;

    // Page break logic
    if (currentYPosition > pageHeight - 40) {
      doc.addPage();
      drawGreenLineWithDate(doc);
      currentYPosition = 45;
    }
  });

  currentYPosition += 10; 

  
});

// Rakennetekniikka osio

doc.addPage();
drawGreenLineWithDate(doc);
currentYPosition = 45;

doc.setFont("Helvetica", "bold");
doc.setFontSize(pageHeaderSize);
doc.text("Rakennetekniikka", margin, currentYPosition);
currentYPosition += 10;

doc.setFont("Helvetica", "normal");
doc.setFontSize(fontSize);
doc.text(RakennetekniikkaText || '', margin, currentYPosition, { maxWidth: 180 });
currentYPosition += 20;
currentYPosition = insertImagesByCategory(doc, imagesByCategory['Rakenteet'], currentYPosition, "Rakenteet");


doc.addPage();
drawGreenLineWithDate(doc);
currentYPosition = 45;

doc.setFont("Helvetica", "bold");
doc.setFontSize(pageHeaderSize);
doc.text("LVI-JÄRJESTELMÄ", margin, currentYPosition);
currentYPosition += 10;

doc.setFont("Helvetica", "normal");
doc.setFontSize(fontSize);
doc.text(LVIText || '', margin, currentYPosition, { maxWidth: 180 });
currentYPosition += 20;
currentYPosition = insertImagesByCategory(doc, imagesByCategory['LVI-laitteet'], currentYPosition, "LVI-laitteet");

doc.addPage();
drawGreenLineWithDate(doc);
currentYPosition = 45;

doc.setFont("Helvetica", "bold");
doc.setFontSize(pageHeaderSize);
doc.text("SÄHKÖJÄRJESTELMÄT", margin, currentYPosition);
currentYPosition += 10;

doc.setFont("Helvetica", "normal");
doc.setFontSize(fontSize);
doc.text(SähköjärjestelmäText || '', margin, currentYPosition, { maxWidth: 180 });
currentYPosition += 20;
currentYPosition = insertImagesByCategory(doc, imagesByCategory['Sähkölaitteet'], currentYPosition, "Sähkölaitteet");


    // Add multiple images to PDF if they exist
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 200;  
        const maxHeight = 200; 

        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

       
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to base64-encoded image
        const compressedImage = canvas.toDataURL('image/jpeg', 1.0); // 0.5 is the compression quality (0-1)

        doc.addImage(compressedImage, 'JPEG', 10, currentYPosition, canvas.width, canvas.height);

        
        currentYPosition += canvas.height + 10;

       
        if (index === images.length - 1) {
          doc.save("report.pdf");
        }
      };
    });
    if (images.length === 0) {
      doc.save("report.pdf");
    }
  };

  return (
    <div className="p-4">
      {/* ✅ Your updated header row */}
      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
  {/* PDF Button */}
  <button onClick={handleExportPdf} className="btn btn-primary">
    Lataa PDF
  </button>

  {/* Uploads for each category */}
  {Object.keys(imagesByCategory).map((category) => (
    <div key={category} className="d-flex align-items-center gap-2">
      <span className="small fw-medium">{category}</span>

      <label htmlFor={`upload-${category}`} className="btn btn-outline-secondary btn-sm mb-0">
        +
      </label>

      <input
        id={`upload-${category}`}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleCategoryImageUpload(e, category)}
        style={{ display: 'none' }}
      />
    </div>
    
  ))}

</div>




  



      

      <div className="mb-6 border p-4 rounded shadow-sm">
  <h3 className="text-lg font-semibold mb-3">📄 Kansisivu</h3>

  <div className="mb-3">
    <label>Raportin Otsikko:</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="form-control"
    />
  </div>
  <div className="mb-3">
        <label>Lisää Kansikuva</label>
        <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  }}
  className="form-control"
        />
      </div>
  <div className="mb-3">
    <label>Asunnon nimi (näkyy kansisivulla):</label>
    <input
      type="text"
      value={PropertyName}
      onChange={(e) => setPropertyName(e.target.value)}
      className="form-control"
      placeholder="Kirjoita kohteen nimi..."
    />
  </div>

  <div className="mb-3">
    <label>Tarkastuspäivä:</label>
    <input
      type="text"
      value={customText}
      onChange={(e) => setCustomText(e.target.value)}
      className="form-control"
      placeholder="Päivämäärä..."
    />
  </div>
</div>


<div className="mb-6 border p-4 rounded shadow-sm">
  <h3 className="text-lg font-semibold mb-3">📝 Johdanto</h3>

  <textarea
    value={johdantoText}
    onChange={(e) => setJohdantoText(e.target.value)}
    className="form-control"
    rows="4"
  />
</div>
<div className="mb-6 border p-4 rounded shadow-sm">
  <h3 className="text-lg font-semibold mb-3">⚙️ Järjestelmäkuvaukset ja Riskiluokitus</h3>

  <textarea
    value={jarjestelmaText}
    onChange={(e) => setJarjestelmaText(e.target.value)}
    className="form-control"
    placeholder="Kirjoita järjestelmä ja riskitiedot..."
    rows="4"
  />
</div>


      <div className="mb-4">
 

 

  {/* Table Rows */}
  {riskidata.map((item, index) => (
    <div
      key={item.id}
      className="grid grid-cols-[200px_200px_1fr] gap-4 items-center px-2 py-2 border-b border-gray-200"
    >
      
      <div className="text-sm font-medium">{item.label}</div>

    
<div className="flex gap-4 items-center">
  {/* Riski Dropdown */}
  <select
    className="py-1 rounded text-sm w-full"
    value={item.risk}
    onChange={(e) => {
      const updated = [...riskidata];
      updated[index].risk = e.target.value;
      setRiskidata(updated);
    }}
  >
    <option value="low">✅ Matala riski</option>
    <option value="medium">🟡 Keskitason riski</option>
    <option value="high">🔴 Korkea riski</option>
  </select>

  {/* Selite Text Input */}
  <input
    type="text"
    className="form-input border px-2 py-1 rounded text-sm w-full"
    placeholder="Kirjoita selite..."
    value={item.description || ''}
    onChange={(e) => {
      const updated = [...riskidata];
      updated[index].description = e.target.value;
      setRiskidata(updated);
    }}
  />
</div>

    </div>
    
  ))}
</div>
<div className="mb-6 border p-4 rounded shadow-sm">
  <h3 className="text-lg font-semibold mb-3">Rakennetekniikka</h3>

  <textarea
    value={RakennetekniikkaText}
    onChange={(e) => setRakennetekniikkaText(e.target.value)}
    className="form-control"
    rows="4"
  />
</div>
<div className="mb-6 border p-4 rounded shadow-sm">
  <h3 className="text-lg font-semibold mb-3">LVI-Järjestelmä</h3>

  <textarea
    value={LVIText}
    onChange={(e) => setLVIText(e.target.value)}
    className="form-control"
    rows="4"
  />
</div>
<div className="mb-6 border p-4 rounded shadow-sm">
  <h3 className="text-lg font-semibold mb-3">Sähköjärjestelmät</h3>

  <textarea
    value={SähköjärjestelmäText}
    onChange={(e) => setSähköjärjestelmäText(e.target.value)}
    className="form-control"
    rows="4"
  />
</div>
    </div>
  ); 
};

export default PropertyDetailsForm;