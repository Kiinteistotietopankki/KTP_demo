import React, { useState } from 'react';

const ImageUploadCategorizer = ({ sections, setSections }) => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      category: 'rakennetekniikka',
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleCategoryChange = (index, category) => {
    const updated = [...uploadedImages];
    updated[index].category = category;
    setUploadedImages(updated);
  };

  const handleRemoveImage = (index) => {
    const updated = [...uploadedImages];
    URL.revokeObjectURL(updated[index].url); 
    updated.splice(index, 1);
    setUploadedImages(updated);
  };

const handleSaveImages = async () => {
  const imagePromises = uploadedImages.map((img) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result,
          category: img.category,
          caption: img.caption || '',
        });
      };
      reader.readAsDataURL(img.file);
    });
  });

  const base64Images = await Promise.all(imagePromises);
  const updatedSections = [...sections];

  base64Images.forEach((img) => {
    const targetIndex = updatedSections.findIndex((s) => s.key === img.category);
    if (targetIndex !== -1) {
      updatedSections[targetIndex].images = [...(updatedSections[targetIndex].images || []), img];
    }
  });

  // Remove from kohteenkuvat
  const kuvaIndex = updatedSections.findIndex((s) => s.key === 'kohteenkuvat');
  if (kuvaIndex !== -1) {
    updatedSections[kuvaIndex].images = [];
  }

  setSections(updatedSections);
  alert('✅ Kuvat tallennettu oikeisiin osioihin!');
  setUploadedImages([]);
};




  return (
    <div className="border p-3 rounded">
      <h5>Lisää kuvia kohteesta</h5>
      <input
        type="file"
        accept="image/*"
        multiple
        className="form-control my-2"
        onChange={handleImageUpload}
      />

      {uploadedImages.length > 0 && (
        <div className="mt-3">
          <div className="d-flex flex-wrap gap-4">
          {uploadedImages.map((img, i) => (
  <div
    key={i}
    className="position-relative text-center border rounded p-2"
    style={{ width: 160 }}
  >
    {/* Remove button */}
    <button
      type="button"
      onClick={() => handleRemoveImage(i)}
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
      alt={`kuva-${i}`}
      style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6 }}
    />

    {/* Category select */}
    <select
      className="form-select form-select-sm mt-2"
      value={img.category}
      onChange={(e) => handleCategoryChange(i, e.target.value)}
    >
      <option value="rakennetekniikka">Rakennetekniikka</option>
      <option value="lvi">LVI</option>
      <option value="sahko">Sähkö</option>
    </select>

    {/* Caption input */}
    <input
      type="text"
      className="form-control form-control-sm mt-2"
      placeholder="Kuvateksti"
      value={img.caption || ''}
      onChange={(e) => {
        const updated = [...uploadedImages];
        updated[i].caption = e.target.value;
        setUploadedImages(updated);
      }}
    />
  </div>
))}

          </div>

          <div className="text-end mt-3">
            <button className="btn btn-primary" onClick={handleSaveImages}>
              💾 Tallenna kuvat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadCategorizer;
