import React, { useState } from 'react';

export default function RakennustietoRow({ otsikko, data, source = '', editable = true, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(data ?? '');

  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => {
    setValue(data ?? '');
    setIsEditing(false);
  };
  const saveEdit = () => {
    setIsEditing(false);
    if (onSave && value !== data) {
      onSave(value);
    }
  };

  return (
    <>
      <dt className="col-sm-3">{otsikko}</dt>
      <dd className={(data === null || data === undefined) && !isEditing ? "text-danger" : ""} style={{ whiteSpace: 'nowrap' }}>
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control form-control-sm d-inline-block w-auto"
              value={value}
              onChange={e => setValue(e.target.value)}
              autoFocus
              style={{ verticalAlign: 'middle' }}
            />
            <button className="btn btn-sm btn-primary ms-2" onClick={saveEdit} type="button">Save</button>
            <button className="btn btn-sm btn-secondary ms-1" onClick={cancelEdit} type="button">Cancel</button>
          </>
        ) : (
          <>
            {data === null || data === undefined ? "Ei tiedossa" : data}
            {editable && (
              <button
                onClick={startEdit}
                type="button"
                aria-label={`Edit ${otsikko}`}
                title="Muokkaa"
                style={{ border: "none", background: "transparent", cursor: "pointer", marginLeft: 8 }}
              >
                <i className="bi bi-pencil-square"></i>
              </button>
            )}
          </>
        )}
        <br />
        <small className="text-muted">Lähde: {source}</small>
      </dd>
    </>
  );
}
