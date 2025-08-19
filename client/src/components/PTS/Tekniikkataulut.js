import React, { useState, useEffect } from 'react';

export default function Tekniikkataulut({ data, setData, onYhteensaChange, type=null}) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
  const years = Array.from({ length: 11 }, (_, i) => startYear + i);

  const initialData = [
    {
      header: 'Aluesähköistys',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      header: 'Kutkinlaitokset ja jakokeskukset',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      header: 'Johdot ja niiden varusteet',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      header: 'Valaisimet, lämmittimet, kojeet ja laitteet',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      header: 'Tele- ja antennijärjestelmät',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      header: 'Palo- ja turvajärjestelmät',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      header: 'Siirtolaitteet',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
  ];

  const [tableData, setTableData] = useState(() => (Array.isArray(data) && data.length > 0 ? data : initialData));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) setTableData(data);
  }, [JSON.stringify(data)]);

  useEffect(() => {
    if (typeof setData === 'function') setData(tableData);
  }, [tableData, setData]);

  const handleValueChange = (sectionIdx, itemIdx, yearIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].values[yearIdx] = value;
    setTableData(updated);
  };

  const handleLabelChange = (sectionIdx, itemIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].label = value;
    setTableData(updated);
  };

  const handleKLChange = (sectionIdx, itemIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].kl = value;
    setTableData(updated);
  };

  const handleAddRow = (sectionIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.push({ label: '', kl: 'KL3', values: Array(11).fill('') });
    setTableData(updated);
  };

  const handleRemoveRow = (sectionIdx, itemIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.splice(itemIdx, 1);
    setTableData(updated);
  };

  const yhteensa = Array(11).fill(0);
  tableData.forEach(section => section.items.forEach(item =>
    item.values.forEach((val, idx) => {
      const num = parseFloat(val);
      if (!isNaN(num)) yhteensa[idx] += num;
    })
  ));

  useEffect(() => { if (onYhteensaChange) onYhteensaChange([...yhteensa]); }, [JSON.stringify(yhteensa)]);

  return (
    <div className="my-4">

      {/* Edit button */}
      <div className="text-center mb-2">
        <button
          className="btn btn-sm btn-success"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Tallenna' : 'Muokkaa'}
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-sm table-borderless mb-0">
          <thead>
            <tr>
              <th colSpan={years.length + 2 + (isEditing ? 1 : 0)} className="bg-success text-white p-2">
                <div className="d-flex justify-content-between">
                  <div className="fw-bold"></div>
                  {!isEditing && <div className="small text-end">Kustannusarvio (x 1000€) Kustannustaso 2025 sis. Alv 25,5%</div>}
                </div>
              </th>
            </tr>
          </thead>

          <thead>
            <tr>
              <th className="bg-success text-white text-start">Osa-alue</th>
              <th className="bg-success text-white text-center">KL</th>
              {years.map(year => (
                <th key={year} className="bg-success text-white text-end px-2">{year}</th>
              ))}
              {isEditing && <th className="bg-success text-white"></th>}
            </tr>
          </thead>

          <tbody>
            {tableData.map((section, sectionIdx) => (
              <React.Fragment key={sectionIdx}>
              <tr>
                <td
                  colSpan={years.length + 2 + (isEditing ? 1 : 0)}
                  className="bg-light fw-semibold text-dark p-2"
                >
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span>{section.header}</span>
                    {isEditing && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleAddRow(sectionIdx)}
                      >
                        +
                      </button>
                    )}

                  </div>
                </td>
              </tr>

                {section.items.map((item, itemIdx) => (
                  <tr key={itemIdx}>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => handleLabelChange(sectionIdx, itemIdx, e.target.value)}
                          className="form-control form-control-sm"
                        />
                      ) : item.label}
                    </td>

                    <td style={{ minWidth: '90px' }}>
                      {isEditing ? (
                        <select
                          value={item.kl}
                          onChange={e => handleKLChange(sectionIdx, itemIdx, e.target.value)}
                          className="form-select form-select-sm"
                        >
                          {['KL1', 'KL2', 'KL3', 'KL4', 'KL5'].map(kl => (
                            <option key={kl} value={kl}>{kl}</option>
                          ))}
                        </select>
                      ) : item.kl}
                    </td>

                    {item.values.map((val, yearIdx) => (
                      <td key={yearIdx} className="text-end px-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={val}
                            onChange={e => handleValueChange(sectionIdx, itemIdx, yearIdx, e.target.value)}
                            className="form-control form-control-sm text-end"
                          />
                        ) : val}
                      </td>
                    ))}

                    {isEditing && (
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveRow(sectionIdx, itemIdx)}
                        >
                          ×
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>

          <tfoot>
            <tr className="fw-bold">
              <td className="bg-success text-white text-start">YHTEENSÄ</td>
              <td className="bg-success text-white"></td>
              {yhteensa.map((sum, idx) => (
                <td key={idx} className="bg-success text-white text-end font-monospace px-2">{sum}</td>
              ))}
              {isEditing && <td className="bg-success text-white"></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
