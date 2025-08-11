import React from 'react';
import JohdantoText from '../../Static/johdando';
import Jarjestelmakuvaus from '../../Static/Jarjestelmariskikuvaus';
import ImageUploadCategorizer from '../ImageUpload';

function RiskMatrixEditor({ riskidata, setRiskidata }) {
  const grouped = riskidata.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});
  return (
    <div className="mt-4 space-y-2">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h5 className="fw-bold border-bottom border-success pb-1 text-uppercase">{category}</h5>
          {items.map((item) => (
            <div key={item.id} className="row align-items-center mb-3">
              <div className="col-12 col-md-3"><strong>{item.label}</strong></div>
              <div className="col-2 col-md-1 text-center">
                <span style={{ fontSize: '1.2rem', color: item.risk === 'low' ? 'green' : item.risk === 'medium' ? 'orange' : 'red' }}>✓</span>
              </div>
              <div className="col-10 col-md-3 mb-2 mb-md-0">
                <select
                  className="form-select form-select-sm"
                  value={item.risk}
                  onChange={(e) => {
                    const updated = [...riskidata];
                    updated[riskidata.findIndex((i) => i.id === item.id)].risk = e.target.value;
                    setRiskidata(updated);
                  }}
                >
                  <option value="low">Matala riski</option>
                  <option value="medium">Keskitason riski</option>
                  <option value="high">Korkea riski</option>
                </select>
              </div>
              <div className="col-12 col-md-5">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Selite"
                  value={item.description || ''}
                  onChange={(e) => {
                    const updated = [...riskidata];
                    updated[riskidata.findIndex((i) => i.id === item.id)].description = e.target.value;
                    setRiskidata(updated);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function SectionsAccordion({ sections, setSections, riskidata, setRiskidata }) {
  return (
    <div className="accordion my-4" id="templateAccordion">
      {sections.map((section, index) => (
        <div className={`accordion-item ${section.include ? 'active-section' : ''}`} key={section.key}>
          <h2 className="accordion-header d-flex align-items-center justify-content-between">
            <div className="d-flex w-100 justify-content-between align-items-center">
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

              {section.key.startsWith('custom-') && (
                <button
                  className="btn btn-sm btn-outline-danger me-3"
                  onClick={() => {
                    const updated = [...sections];
                    updated.splice(index, 1);
                    setSections(updated);
                  }}
                >
                  🗑️
                </button>
              )}
            </div>
          </h2>

          <div id={`template-collapse-${index}`} className={`accordion-collapse collapse ${section.include ? 'show' : ''}`}>
            <div className="accordion-body">
              {!['rakennetekniikka', 'lvi', 'sahko'].includes(section.key) && (
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

              {section.images?.length > 0 && (
                <div className="mt-3 d-flex flex-wrap gap-3">
                  {section.images.map((img, imgIndex) => (
                    <div key={imgIndex} className="position-relative border rounded p-2 text-center d-flex flex-column align-items-center" style={{ width: 160 }}>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...sections];
                          updated[index].images = updated[index].images.filter((_, i) => i !== imgIndex);
                          setSections(updated);
                        }}
                        style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: 'red', fontWeight: 'bold', fontSize: '1.25rem', cursor: 'pointer', lineHeight: 1 }}
                      >
                        X
                      </button>

                      <img src={img.url} alt={`kuva-${imgIndex}`} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 4 }} />

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
                <RiskMatrixEditor riskidata={riskidata} setRiskidata={setRiskidata} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
