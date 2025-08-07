import React from 'react';

const ImageUploadCategorizer = ({ sections, setSections, sectionKey }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ url: reader.result, caption: '' });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImages => {
      const updatedSections = [...sections];
      const sectionIndex = updatedSections.findIndex(s => s.key === sectionKey);

      if (sectionIndex !== -1) {
        updatedSections[sectionIndex].images = [
          ...(updatedSections[sectionIndex].images || []),
          ...newImages
        ];
        setSections(updatedSections);
      }
    });
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="form-control mb-2"
      />
    </div>
  );
};

export default ImageUploadCategorizer;