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
  const source = rakennus?.metadata?.[field]?.source ?? '';

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(valueFromData);

  const startEdit = () => setIsEditing(true);

  const cancelEdit = () => {
    setValue(valueFromData);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    if (value !== valueFromData) {
      try {
        await updateRakennus(rakennus.id_rakennus, { [field]: value });
        console.log(`Updated ${field} successfully`);
        // Optionally: add success UI feedback here
      } catch (err) {
        alert(
          `Kentän "${otsikko}" tallennus epäonnistui: ${
            err.response?.data?.message || err.message
          }`
        );
      }
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
          <>
            <input
              type="text"
              className="form-control form-control-sm d-inline-block w-auto"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              style={{ verticalAlign: 'middle' }}
            />
            <button
              className="btn btn-sm btn-primary ms-2"
              onClick={saveEdit}
              type="button"
            >
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary ms-1"
              onClick={cancelEdit}
              type="button"
            >
              Cancel
            </button>
          </>
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
          </>
        )}
        {showSource && (
          <>
            <br />
            <small className="text-muted">Lähde: {source}</small>
          </>
        )}
      </dd>
    </>
  );
}
