import { useState } from 'react';
import { updateRakennus } from '../api/api'; 

export default function RakennustietoRow({
  otsikko,
  rakennus,
  field,
  editable = true,
  showSource = true,
  options = null  // <-- jos halutaan rajoittaa käyttäjän valintoja
}) {
  const valueFromData = rakennus?.[field] ?? '';
  const sourceFromData = rakennus?.metadata?.[field]?.source ?? '';

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(valueFromData);
  const [source, setSource] = useState(sourceFromData);
  const [tempAlert, setTempAlert] = useState(null);

  const startEdit = () => setIsEditing(true);

  const cancelEdit = () => {
    setValue(valueFromData);
    setSource(sourceFromData);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);

    const updates = [];

    if (value !== valueFromData) {
      const obj = {
        [field]: value
      };

      if (source !== sourceFromData) {
        // Wrap source inside metadata under the field key
        obj.metadata = {
          [field]: { source }
        };
      }

      updates.push(obj);
    }

    // If only source changed but value stayed the same
    if (value === valueFromData && source !== sourceFromData) {
      updates.push({
        [field]: valueFromData,
        metadata: {
          [field]: { source }
        }
      });
    }

    if (updates.length === 0) return;

    try {
      await updateRakennus(rakennus.id_rakennus, updates);
      setTempAlert({ type: 'success', message: `"${otsikko}" päivitetty onnistuneesti!` });
      setTimeout(() => setTempAlert(null), 4000); // dismiss after 3s
    } catch (err) {
      setTempAlert({ type: 'danger', message: `Kentän "${otsikko}" tallennus epäonnistui: ${err.response?.data?.message || err.message}` });
      setTimeout(() => setTempAlert(null), 4000); // dismiss after 3s
    }
  };

  const displayValue = (() => {
    if (!options) return valueFromData;
    const code = Object.entries(options).find(
      ([_, label]) => label === valueFromData
    )?.[0];
    return options[code] || valueFromData || 'Ei tiedossa';
  })();

  return (
    <>
      <dt className="col-sm-3">{otsikko}</dt>
      {tempAlert && (
        <div className={`alert alert-${tempAlert.type} p-2`} role="alert">
          {tempAlert.message}
        </div>
      )}
      <dd
        className={
          (valueFromData === '' || valueFromData === null) && !isEditing
            ? 'text-danger'
            : ''
        }
        style={{ whiteSpace: 'nowrap' }}
      >
        {isEditing ? (
          <div className="d-flex flex-column gap-2">
            {options ? (
            <select
              className="form-select form-select-sm"
              value={(() => {
                // Find code where label matches the current value
                const matchedEntry = Object.entries(options).find(
                  ([_, label]) => label === value
                );
                return matchedEntry?.[0] || '';
              })()}
              onChange={(e) => {
                const selectedCode = e.target.value;
                const selectedLabel = options[selectedCode] || '';
                setValue(selectedLabel); // Store label, not code
              }}
              autoFocus
            >
              <option value="">-- Valitse --</option>
              {Object.entries(options).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            ) : (
              <input
                type="text"
                className="form-control form-control-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
              />
            )}

            {showSource && (
              <input
                type="text"
                className="form-control form-control-sm"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Lähde"
              />
            )}
            <div>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={saveEdit}
                type="button"
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={cancelEdit}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {displayValue === '' ? 'Ei tiedossa' : displayValue}
            {editable && (
              <button
                onClick={startEdit}
                type="button"
                aria-label={`Edit ${otsikko}`}
                title="Muokkaa"
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  marginLeft: 8,
                }}
              >
                <i className="bi bi-pencil-square"></i>
              </button>
            )}
            {showSource && (
              <>
                <br />
                <small className="text-muted">Lähde: {sourceFromData}</small>
              </>
            )}
          </>
        )}
      </dd>
    </>
  );
}