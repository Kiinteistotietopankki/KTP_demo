import React from 'react';
import ImageUploadCategorizer from '../ImageUpload';

export default function ImageBlocks({ sections, setSections }) {
  const keys = ['rakennetekniikka', 'sahko', 'lvi'];
  const labels = {
    rakennetekniikka: '📷 Rakenne-kuvat',
    sahko: '📷 Sähkö-kuvat',
    lvi: '📷 LVI-kuvat',
  };

  return (
    <>
      {keys.map((key) => {
        const idx = sections.findIndex((s) => s.key === key);
        if (idx === -1) return null;
        return (
          <div className="border p-4 rounded shadow-sm my-4" key={key}>
            <h4 className="text-md fw-semibold mb-3">{labels[key]}</h4>
            <ImageUploadCategorizer sections={sections} setSections={setSections} sectionKey={key} />
          </div>
        );
      })}
    </>
  );
}
