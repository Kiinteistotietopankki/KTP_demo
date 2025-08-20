import React from 'react';
import JohdantoText from '../../Static/johdando';
import Jarjestelmakuvaus from '../../Static/Jarjestelmariskikuvaus';
import ImageUploadCategorizer from '../ImageUpload';

function normalizeItem(raw) {
  if (typeof raw === 'string') {
    return { text: raw, includeInPTS: false, ptsCategory: 'Rakennetekniikka', kl: 'KL3', ptsSection: '' };
  }
  return {
    text: raw?.text || '',
    includeInPTS: !!raw?.includeInPTS,
    ptsCategory: raw?.ptsCategory || 'Rakennetekniikka',
    kl: raw?.kl || 'KL3',
    ptsSection: raw?.ptsSection || '',
  };
}

function ActionEditor({ items = [], onChange, availablePTSSections }) {
  const list = (Array.isArray(items) ? items : []).map(normalizeItem);

  const update = (idx, patch) => {
    const next = list.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    onChange(next);
  };
  const addItem = () => onChange([...list, normalizeItem('')]);
  const removeItem = (i) => onChange(list.filter((_, idx) => idx !== i));

  if (items === undefined) {
    return (
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => onChange([normalizeItem('')])}
        title="Lisää toimenpide-ehdotukset -lohko"
      >
        + Toimenpide-ehdotukset
      </button>
    );
  }

  return (
    <div className="border rounded p-2 mt-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Toimenpide-ehdotukset:</strong>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addItem}>
          + rivi
        </button>
      </div>

      {list.map((row, i) => (
        <div key={i} className="mb-2 p-2 border rounded">
          <div className="d-flex align-items-start gap-2">
            <span className="mt-1">•</span>
            <input
              className="form-control form-control-sm"
              value={row.text}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder="Kirjoita toimenpide..."
            />
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => removeItem(i)}
              title="Poista rivi"
            >
              ✕
            </button>
          </div>

          <div className="row g-2 mt-2">
            <div className="col-auto d-flex align-items-center">
              <input
                id={`inc-${i}`}
                type="checkbox"
                className="form-check-input me-2"
                checked={row.includeInPTS}
                onChange={(e) => update(i, { includeInPTS: e.target.checked })}
              />
              <label htmlFor={`inc-${i}`} className="form-check-label">
                Vie PTS:ään
              </label>
            </div>

            <div className="col-auto">
              <select
                className="form-select form-select-sm"
                value={row.ptsCategory}
                onChange={(e) => update(i, { ptsCategory: e.target.value })}
                disabled={!row.includeInPTS}
              >
                <option>Rakennetekniikka</option>
                <option>LVI Järjestelmät</option>
                <option>Sähköjärjestelmät</option>
                <option>Lisätutkimukset</option>
              </select>
            </div>

           
            <div className="col-auto" style={{ minWidth: 220 }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="PTS-osio"
                list={`pts-osio-${i}`}
                value={row.ptsSection || ''}
                onChange={(e) => update(i, { ptsSection: e.target.value })}
                disabled={!row.includeInPTS}
              />
              <datalist id={`pts-osio-${i}`}>
                {(availablePTSSections?.[row.ptsCategory] || []).map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div className="col-auto">
              <select
                className="form-select form-select-sm"
                value={row.kl}
                onChange={(e) => update(i, { kl: e.target.value })}
                disabled={!row.includeInPTS}
              >
                {['KL1', 'KL2', 'KL3', 'KL4', 'KL5'].map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const makeId = () => Math.random().toString(36).slice(2, 9);

const getSectionNumber = (sections, idx) =>
  sections.slice(0, idx + 1).filter((s) => s.include).length;

const johdantoDefaultFields = [
  { key: 'toimeksiantaja', label: 'Toimeksiantaja', multiline: true },
  { key: 'koordinaattori', label: 'Koordinaattori' },
  { key: 'koordinaattori_title', label: 'Koordinaattorin tarkastajan ammattinimike' },
  { key: 'rakennustekniikka', label: 'Rakennustekniikka' },
  { key: 'rakennustekniikka_title', label: 'Rakennustekniikan ammattinimike' },
  { key: 'lvia', label: 'LVIA-järjestelmät' },
  { key: 'lvia_title', label: 'LVIA:n ammattinimike' },
  { key: 'sahko', label: 'Sähköjärjestelmät' },
  { key: 'sahko_title', label: 'Sähköntekniikan ammattinimike' },
];

function RiskMatrixEditor({ riskidata, setRiskidata }) {
  const [editingLabelId, setEditingLabelId] = React.useState(null);
  const [tempLabel, setTempLabel] = React.useState('');

  const startEditLabel = (item) => {
    setEditingLabelId(item.id);
    setTempLabel(item.label || '');
  };

  const saveLabel = (itemId) => {
    const updated = [...riskidata];
    const idx = updated.findIndex((i) => i.id === itemId);
    if (idx !== -1) updated[idx].label = tempLabel;
    setRiskidata(updated);
    setEditingLabelId(null);
    setTempLabel('');
  };

  const cancelEdit = () => {
    setEditingLabelId(null);
    setTempLabel('');
  };

  const grouped = riskidata.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  return (
    <div className="mt-4 space-y-2">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h5 className="fw-bold border-bottom border-success pb-1 text-uppercase">{category}</h5>

          {items.map((item) => {
            const isEditing = editingLabelId === item.id;
            const riskColor =
              item.risk === 'low' ? 'green' : item.risk === 'medium' ? 'orange' : 'red';

            return (
              <div key={item.id} className="row align-items-center mb-3">
                {/* Label ja edit pencil */}
                <div className="col-12 col-md-3 d-flex align-items-center">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="form-control form-control-sm me-2"
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success me-1"
                        onClick={() => saveLabel(item.id)}
                        title="Tallenna nimi"
                        aria-label="Tallenna nimi"
                        style={{ padding: '2px 6px' }}
                      >
                        <i className="bi bi-check" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={cancelEdit}
                        title="Peruuta"
                        aria-label="Peruuta"
                        style={{ padding: '2px 6px' }}
                      >
                        <i className="bi bi-x" />
                      </button>
                    </>
                  ) : (
                    <>
                      <strong className="text-truncate" title={item.label} style={{ maxWidth: '100%' }}>
                        {item.label}
                      </strong>
                      <button
                        type="button"
                        className="btn btn-link btn-sm ms-2 p-0"
                        onClick={() => startEditLabel(item)}
                        title="Muokkaa nimeä"
                        aria-label="Muokkaa nimeä"
                        style={{ textDecoration: 'none' }}
                      >
                        <i className="bi bi-pencil-square" style={{ color: 'gray' }} />
                      </button>
                    </>
                  )}
                </div>

               
                <div className="col-2 col-md-1 text-center">
                  <span style={{ fontSize: '1.2rem', color: riskColor }}>✓</span>
                </div>

                {/* Risk select */}
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

                
                <div className="col-10 col-md-4">
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

                
                <div className="col-2 col-md-1 text-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setRiskidata(riskidata.filter((i) => i.id !== item.id))}
                    title="Poista rivi"
                    aria-label="Poista rivi"
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function SectionsAccordion({
  sections,
  setSections,
  riskidata,
  setRiskidata,
  availablePTSSections, 
}) {
  const addSubsection = (sectionIndex) => {
    const updated = [...sections];
    const arr = updated[sectionIndex].subsections || [];
    arr.push({ id: makeId(), label: 'Uusi aliotsikko', text: '' });
    updated[sectionIndex].subsections = arr;
    setSections(updated);
  };

  const updateSub = (sectionIndex, subIndex, patch) => {
    const updated = [...sections];
    updated[sectionIndex].subsections[subIndex] = {
      ...updated[sectionIndex].subsections[subIndex],
      ...patch,
    };
    setSections(updated);
  };

  const removeSub = (sectionIndex, subIndex) => {
    const updated = [...sections];
    updated[sectionIndex].subsections.splice(subIndex, 1);
    setSections(updated);
  };


  return (
    <div className="accordion my-4" id="templateAccordion">
      {sections.map((section, index) => (
        <div
          className={`accordion-item ${section.include ? 'active-section' : ''}`}
          key={section.key}
        >
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
                  if (
                    updated[index].include &&
                    section.key === 'johdanto' &&
                    !updated[index].content
                  ) {
                    updated[index].content = JohdantoText.Option1;
                  }
                  if (
                    updated[index].include &&
                    section.key === 'jarjestelma' &&
                    !updated[index].content
                  ) {
                    updated[index].content = Jarjestelmakuvaus.option1;
                  }
                  setSections(updated);
                }}
              >
                {section.label}
              </button>

              <div className="d-flex align-items-center gap-2 me-3">
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                    onClick={() => addSubsection(index)}
                  >
                    Lisää aliotsikko
                  </button>
                </div>

                {section.key.startsWith('custom-') && (
                  <button
                    className="btn btn-sm btn-outline-danger"
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
            </div>
          </h2>

          <div
            id={`template-collapse-${index}`}
            className={`accordion-collapse collapse ${section.include ? 'show' : ''}`}
          >
            <div className="accordion-body">
             
              {section.key === 'johdanto' && (
  <div className="mb-3">
   
    {(() => {
      const updateField = (key, value) => {
        const updated = [...sections];
        updated[index].fields = { ...(updated[index].fields || {}), [key]: value };
        setSections(updated);
      };

      const F = section.fields || {};

      return (
        <>
          {/* Toimeksiantaja */}
          <div className="mb-3">
            <label className="form-label small text-muted mb-1 fw-semibold">
              Toimeksiantaja
            </label>
            <textarea
              className="form-control form-control-sm"
              rows="3"
              value={F.toimeksiantaja || ''}
              onChange={(e) => updateField('toimeksiantaja', e.target.value)}
            />
          </div>

          {/* Koordinaattori ja ammattinimike */}
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1 fw-semibold">
                Koordinaattori
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={F.koordinaattori || ''}
                onChange={(e) => updateField('koordinaattori', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1 fw-semibold">
                Koordinaattorin ammattinimike
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={F.koordinaattori_title || ''}
                onChange={(e) => updateField('koordinaattori_title', e.target.value)}
              />
            </div>
          </div>

          {/* Rakennustekniikka ja ammattinimike */}
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1 fw-semibold">
                Rakennustekniikka
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={F.rakennustekniikka || ''}
                onChange={(e) => updateField('rakennustekniikka', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1 fw-semibold">
                Rakennustekniikan ammattinimike
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={F.rakennustekniikka_title || ''}
                onChange={(e) => updateField('rakennustekniikka_title', e.target.value)}
              />
            </div>
          </div>

          {/* LVI +ja ammattinimike */}
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1 fw-semibold">
                LVI-järjestelmät
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={F.lvia || ''}
                onChange={(e) => updateField('lvia', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1 fw-semibold">
                LVI:n ammattinimike
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={F.lvia_title || ''}
                onChange={(e) => updateField('lvia_title', e.target.value)}
              />
            </div>
          </div>

          {/* Sähköjärjestelmät jaa Sähkötekniikan ammattinimike */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1 fw-semibold">
                Sähköjärjestelmät
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={F.sahko || ''}
                onChange={(e) => updateField('sahko', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1 fw-semibold">
                Sähkötekniikan ammattinimike
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={F.sahko_title || ''}
                onChange={(e) => updateField('sahko_title', e.target.value)}
              />
            </div>
          </div>
        </>
      );
    })()}

    
        <ActionEditor
                    items={section.actionItems}
                    onChange={(next) => {
                      const updated = [...sections];
                      updated[index].actionItems = next;
                      setSections(updated);
                    }}
                    availablePTSSections={availablePTSSections}
                  />
                </div>
              )}

              {!['rakennetekniikka','lvi','sahko','johdanto','pts-ehdotukset','energia'].includes(section.key) && (
                <>
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
                  <ActionEditor
                    items={section.actionItems}
                    onChange={(next) => {
                      const updated = [...sections];
                      updated[index].actionItems = next;
                      setSections(updated);
                    }}
                    availablePTSSections={availablePTSSections}
                  />
                </>
              )}

              
              {Array.isArray(section.subsections) &&
                section.subsections.map((sub, subIndex) => (
                  <div key={sub.id} className="mb-2 ps-3 border-start">
                    <div className="d-flex align-items-center mb-1">
                      <input
                        type="text"
                        className="form-control form-control-sm me-2"
                        placeholder="Aliotsikon nimi"
                        value={sub.label}
                        onChange={(e) => updateSub(index, subIndex, { label: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        style={{ padding: '0 6px', fontSize: '0.8rem' }}
                        onClick={() => removeSub(index, subIndex)}
                        title="Poista aliotsikko"
                      >
                        ✕
                      </button>
                    </div>

                    <textarea
                      className="form-control form-control-sm"
                      rows="3"
                      placeholder="Aliotsikon sisältö"
                      value={sub.text}
                      onChange={(e) => updateSub(index, subIndex, { text: e.target.value })}
                    />

                    
                    <ActionEditor
                      items={sub.actionItems}
                      onChange={(next) => updateSub(index, subIndex, { actionItems: next })}
                      availablePTSSections={availablePTSSections}
                    />
                  </div>
                ))}

              {section.key === 'kohteenkuvat' && (
                <ImageUploadCategorizer sections={sections} setSections={setSections} />
              )}

              {section.images?.length > 0 && (
                <div className="mt-3 d-flex flex-wrap gap-3">
                  {section.images.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="position-relative border rounded p-2 text-center d-flex flex-column align-items-center"
                      style={{ width: 160 }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...sections];
                          updated[index].images = updated[index].images.filter((_, i) => i !== imgIndex);
                          setSections(updated);
                        }}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 6,
                          background: 'transparent',
                          border: 'none',
                          color: 'red',
                          fontWeight: 'bold',
                          fontSize: '1.25rem',
                          cursor: 'pointer',
                          lineHeight: 1,
                        }}
                        aria-label="Poista kuva"
                        title="Poista kuva"
                      >
                        X
                      </button>

                      <img
                        src={img.url}
                        alt={`kuva-${imgIndex}`}
                        style={{
                          width: '100%',
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 6,
                          marginBottom: 4,
                        }}
                      />

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
               {section.key === 'pts-ehdotukset' && (
                <div> pts sisältävät ehdotukset</div>
              )}
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
}
