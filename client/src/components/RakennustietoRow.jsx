import React, { useState } from 'react';
import { updateRakennus } from '../api/api'; // your updated api function

export default function RakennustietoRow({
  otsikko,
  rakennus,
  field,
  editable = true,
  showSource = true,
}) {
  const valueFromData = rakennus?.[field] ?? '';
  const sourceFromData = rakennus?.metadata?.[field]?.source ?? '';

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(valueFromData);
  const [source, setSource] = useState(sourceFromData);

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
      // alert(`"${otsikko}" päivitetty onnistuneesti!`);
      window.location.reload();  // refreshes the current page
    } catch (err) {
      alert(
        `Kentän "${otsikko}" tallennus epäonnistui: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };


  return (
    <>
      <dt className="col-sm-3">{otsikko}</dt>
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
    <input
      type="text"
      className="form-control form-control-sm"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoFocus
    />
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
            {valueFromData === '' ? 'Ei tiedossa' : valueFromData}
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