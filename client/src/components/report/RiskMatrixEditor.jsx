import React from 'react';

export function RiskMatrixEditor({ riskidata, setRiskidata }) {
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
                {/* Label + edit pencil */}
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
                        <i className="bi bi-pencil-square"style={{ color: 'gray' }}></i>

                      </button>
                    </>
                  )}
                </div>

                {/* Color check */}
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

                {/* Description */}
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

                {/* Remove */}
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