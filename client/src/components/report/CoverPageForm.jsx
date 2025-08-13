import React from 'react';

export default function CoverPageForm({
  title, setTitle,
  coverImage, setCoverImage,
  propertyName, setPropertyName,
  dateIso, setDateIso,
  selectedTemplate, setSelectedTemplate,
  templates,
}) {
  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
  };

  return (
    <div className="border p-4 rounded shadow-sm">
      <h3 className="text-xl font-semibold mb-4">📄 Kansisivu</h3>

      <label className="font-semibold text-sm">Valitse raporttipohja:</label>
      <select
        className="form-select mt-1 mb-3"
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
      >
        {Object.entries(templates).map(([key, tpl]) => (
          <option key={key} value={key}>{tpl.name}</option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={handleCoverImageUpload}
        className="form-control mb-3"
      />

      
      {coverImage && (
        <div className="mb-3">
          <div className="position-relative d-inline-block">
            <img
              src={coverImage}
              alt="Cover Preview"
              style={{
                maxWidth: '150px',
                maxHeight: '100px',
                objectFit: 'cover',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={handleRemoveCoverImage}
              className="btn btn-sm btn-danger position-absolute top-0 end-0"
              style={{ transform: 'translate(50%, -50%)' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <input
        type="text"
        value={propertyName}
        onChange={(e) => setPropertyName(e.target.value)}
        placeholder="Kohteen nimi"
        className="form-control mb-3"
      />

      <input
        type="date"
        value={dateIso}
        onChange={(e) => setDateIso(e.target.value)}
        className="form-control"
      />
    </div>
  );
}
