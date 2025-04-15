import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Riskidataa } from '../assets/Riskidata';

const PropertyDetailsForm = ({ rakennus }) => {
  const [title, setTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const [johdantoText, setJohdantoText] = useState('');
  const [sisaltoText, setSisaltoText] = useState('');
  const [jarjestelmaText, setJarjestelmaText] = useState('');
  const [PropertyName, setPropertyName] = useState('');
  const [riskidata, setRiskidata] = useState(Riskidataa);
  const [images, setImages] = useState([]); // Store multiple images as an array

  // Handle multiple image file uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);  // Convert FileList to array
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);  // Store image data URL
        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);  // Update images state
        }
      };
      reader.readAsDataURL(file);  // Read each image as a data URL
    });
  };

  const getRiskMark = (risk) => {
    switch (risk) {
      case 'low':
        return <span style={{ color: 'green' }}>✓</span>; // Green checkmark for low risk
      case 'medium':
        return <span style={{ color: 'yellow' }}>✓</span>; // Yellow checkmark for medium risk
      case 'high':
        return <span style={{ color: 'red' }}>✓</span>; // Red checkmark for high risk
      default:
        return null;
    }
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
    
        // Label
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(label, margin, y);
    
        // Icon
        doc.setTextColor(...color);
        doc.setFont("Helvetica", "bold");
        doc.text(icon, margin + 70, y);
    
        // Description
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
    
      return y + 5; // Add bottom space before next section
    };
    

    // Start creating the document
    drawGreenLineWithDate(doc);
    currentYPosition = 45;

    // Title Section
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(headingFontSize);
    doc.text(title || "Raportin otsikko", margin, currentYPosition);
    currentYPosition += 10;

    // Custom Text Section
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(fontSize);
    const customTextY = pageHeight - 40; // Adjust this value for spacing from the bottom
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

    // Table of Contents Section
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(pageHeaderSize);
    doc.text("Sisällysluettelo", margin, currentYPosition);
    currentYPosition += 10;
    doc.addPage();
    drawGreenLineWithDate(doc);
    currentYPosition = 45;
    // Start with the main content
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(pageHeaderSize);
    doc.text("3. Kohteen Perustiedot", margin, currentYPosition);
    currentYPosition += 7;
    
    // Draw horizontal line
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
    const valueX = pageWidth - margin; // Right-align values
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
    
    // Filter groups
    // Group items by category
const groupedRiskidata = riskidata.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {});

// Loop through each category and render its items
Object.entries(groupedRiskidata).forEach(([category, items]) => {
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(pageHeaderSize);
  doc.text(category.toUpperCase(), margin, currentYPosition);
  currentYPosition += 8;

  // Draw horizontal line under the header
  doc.setLineWidth(0.5);
  doc.line(margin, currentYPosition, 195, currentYPosition);
  currentYPosition += 5;

  // Table headers
  doc.setFontSize(10);
  doc.setFont("Helvetica", "bold");
  doc.text("Nimi", margin, currentYPosition);
  doc.text("Riski", margin + 80, currentYPosition);
  doc.text("Selite", margin + 120, currentYPosition);
  currentYPosition += 6;

  // Draw another separator line
  doc.setLineWidth(0.2);
  doc.line(margin, currentYPosition, 195, currentYPosition);
  currentYPosition += 5;

  // Loop through items
  doc.setFont("Helvetica", "normal");
  items.forEach((item) => {
    const riskLevelText =
      item.risk === 'low' ? '\u2714' :
      item.risk === 'medium' ? 'Keskitason riski' :
      item.risk === 'high' ? 'Korkea riski' : '';

    const description = item.description || '';

    // Text wrapping for long descriptions
    const descLines = doc.splitTextToSize(description, 65);
    const lineCount = Math.max(1, descLines.length);

    // Print name, risk, and description (first line)
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

  currentYPosition += 10; // Add some space before next section
});





    // Add multiple images to PDF if they exist
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 200;  // Set the max width for the image (can adjust to your preference)
        const maxHeight = 200;  // Set the max height for the image (can adjust to your preference)

        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw the image onto the canvas with the new size
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to base64-encoded image
        const compressedImage = canvas.toDataURL('image/jpeg', 1.0); // 0.5 is the compression quality (0-1)

        // Add the image to the PDF at position (10, 10)
        doc.addImage(compressedImage, 'JPEG', 10, currentYPosition, canvas.width, canvas.height);

        // Adjust yPosition for next image
        currentYPosition += canvas.height + 10;

        // Save the PDF after all images are added
        if (index === images.length - 1) {
          doc.save("report.pdf");
        }
      };
    });

    // If no images, just save the PDF
    if (images.length === 0) {
      doc.save("report.pdf");
    }
  };

  return (
    <div>
      <button onClick={handleExportPdf} className="btn btn-primary mb-4">Lataa PDF</button>

      <div className="mb-3">
        <label>Raportin Otsikko (kuntotarkistus/muu?):</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Asunnon nimi (näkyy alareunassa ja bannerissa):</label>
        <input
          type="text"
          value={PropertyName}
          onChange={e => setPropertyName(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Tarkastuspäivä :</label>
        <textarea
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Johdanto:</label>
        <textarea
          value={johdantoText}
          onChange={e => setJohdantoText(e.target.value)}
          className="form-control"
          rows="4"
        />
      </div>

      <div className="mb-3">
        <label>Järjestelmäkuvaukset ja Riskiluokitus:</label>
        <textarea
          value={jarjestelmaText}
          onChange={e => setJarjestelmaText(e.target.value)}
          className="form-control"
          rows="4"
        />
      </div>

      <div className="mb-3">
        <label>Lisää kuvia</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="form-control"
        />
      </div>

      <div className="mb-4">
  <h3>Riskiluokat</h3>
  {riskidata.map((item, index) => (
    <div key={item.id} className="mb-4">
      <label className="form-label">{item.label}</label>
      <select
        className="form-control mb-2"
        value={item.risk}
        onChange={(e) => {
          const updated = [...riskidata];
          updated[index].risk = e.target.value;
          setRiskidata(updated);
        }}
      >
        <option value="low">?</option>
        <option value="medium">Keskitason riski</option>
        <option value="high">Korkea riski</option>
      </select>
      
      <label className="form-label">Selite:</label>
      <textarea
        className="form-control"
        rows="2"
        value={item.description || ''}
        onChange={(e) => {
          const updated = [...riskidata];
          updated[index].description = e.target.value;
          setRiskidata(updated);
        }}
      />
      <div>
        Riskiluokka: {getRiskMark(item.risk)}
      </div>
    </div>
  ))}
</div>

    </div>
  ); 
};

export default PropertyDetailsForm;
