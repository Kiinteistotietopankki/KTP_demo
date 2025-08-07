import React, { useState, useEffect } from 'react';

export default function LVITable({ onYhteensaChange, setData, data }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 = Jan, 6 = Jul
  const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
  const years = Array.from({ length: 11 }, (_, i) => startYear + i);

  const initialData = [
    {
      name: 'Lämmöntuotanto',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      name: 'Lämmitysverkosto',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      name: 'Vesijohtoverkosto',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
    {
      name: 'Ilmanvaihtojärjestelmä',
      items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
    },
  ];

  // 🧠 Use external `data` if provided
  const [tableData, setTableData] = useState(() =>
    Array.isArray(data) && data.length > 0 ? data : initialData
  );

useEffect(() => {
  if (Array.isArray(data) && data.length > 0) {
    setTableData(data);
  }
}, [JSON.stringify(data)]);

  // 🔄 Sync updated tableData to parent
  useEffect(() => {
    if (typeof setData === 'function') {
      setData(tableData);
    }
  }, [tableData, setData]);

  // 💡 Compute YHTEENSÄ row
  const yhteensa = Array(11).fill(0);
  tableData.forEach(section => {
    section.items.forEach(item => {
      item.values.forEach((val, idx) => {
        const num = parseFloat(val);
        if (!isNaN(num)) yhteensa[idx] += num;
      });
    });
  });

  useEffect(() => {
    if (onYhteensaChange) {
      onYhteensaChange([...yhteensa]); // clone to avoid mutation
    }
  }, [JSON.stringify(yhteensa)]);

  // 🔧 Event handlers
  const handleValueChange = (sectionIdx, itemIdx, yearIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].values[yearIdx] = value;
    setTableData(updated);
  };

  const handleAddRow = (sectionIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.push({
      label: '',
      kl: 'KL3',
      values: Array(11).fill(''),
    });
    setTableData(updated);
  };

  const handleRemoveRow = (sectionIdx, itemIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.splice(itemIdx, 1);
    setTableData(updated);
  };

  return (
    <div className="accordion my-4" id="lvijarjestelmatAccordion">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingLVI">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseLVI"
            aria-expanded="false"
            aria-controls="collapseLVI"
          >
            LVI-tekniikka
          </button>
        </h2>

        <div
          id="collapseLVI"
          className="accordion-collapse collapse"
          aria-labelledby="headingLVI"
          data-bs-parent="#lvijarjestelmatAccordion"
        >
          <div className="responsive-table-container">
                  <table className="table table-sm mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: '180px' }}>Osa-alue</th>
                  <th style={{ minWidth: '90px' }}>KL</th>
                  {years.map(year => (
                    <th key={year} className="text-center">{year}</th>
                  ))}
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((section, sectionIdx) => (
                  <React.Fragment key={sectionIdx}>
                    <tr className="bg-secondary text-white">
                      <td colSpan={years.length + 3} className="fw-semibold d-flex justify-content-between align-items-center">
                        {section.name}
                        <button
                          onClick={() => handleAddRow(sectionIdx)}
                          className="btn btn-sm btn-light text-dark border"
                          title="Lisää rivi"
                        >
                          +
                        </button>
                      </td>
                    </tr>

                    {section.items.map((item, itemIdx) => (
                      <tr key={itemIdx}>
                        <td>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...tableData];
                              updated[sectionIdx].items[itemIdx].label = e.target.value;
                              setTableData(updated);
                            }}
                            className="form-control form-control-sm"
                          />
                        </td>
                        <td>
                          <select
                            value={item.kl}
                            onChange={(e) => {
                              const updated = [...tableData];
                              updated[sectionIdx].items[itemIdx].kl = e.target.value;
                              setTableData(updated);
                            }}
                            className="form-select form-select-sm"
                          >
                            {['KL1', 'KL2', 'KL3', 'KL4', 'KL5'].map(kl => (
                              <option key={kl} value={kl}>{kl}</option>
                            ))}
                          </select>
                        </td>
                        {item.values.map((val, yearIdx) => (
                          <td key={yearIdx}>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) =>
                                handleValueChange(sectionIdx, itemIdx, yearIdx, e.target.value)
                              }
                              className="form-control form-control-sm text-end"
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            onClick={() => handleRemoveRow(sectionIdx, itemIdx)}
                            className="btn btn-sm btn-outline-danger"
                            title="Poista rivi"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>

              <tfoot>
                <tr className="table-success fw-bold">
                  <td>YHTEENSÄ</td>
                  <td></td>
                  {yhteensa.map((sum, idx) => (
                    <td key={idx} className="text-center">{sum}</td>
                  ))}
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
