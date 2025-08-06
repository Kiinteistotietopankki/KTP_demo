import React, { useEffect, useState } from 'react';

export default function Tekniikkataulut({ data, setData, onYhteensaChange }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
  const years = Array.from({ length: 11 }, (_, i) => startYear + i);

  const [tableData, setTableData] = useState(data || []);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  useEffect(() => {
    if (typeof setData === 'function') {
      setData(tableData);
    }
  }, [tableData]);

  useEffect(() => {
  if (!Array.isArray(data) || data.length === 0) {
    // Use initial fallback only once
    if (tableData.length === 0) {
   const fallback = initialData;
      setTableData(fallback);
    }
    return;
  }

  // Normalize and compare with existing tableData
  const normalized = data.map(section => ({
    header: section.header || section.name || 'Osa-alue',
    items: (section.items || []).map(item => ({
      label: item.label || item.name || '',
      kl: item.kl || 'KL3',
      values: item.values || Array(11).fill('')
    }))
  }));

  // Only set if it's truly different to avoid flicker
  const jsonNew = JSON.stringify(normalized);
  const jsonOld = JSON.stringify(tableData);
  if (jsonNew !== jsonOld) {
    setTableData(normalized);
  }

}, [data]);

 const initialData = [
  {
    name: 'Aluesähköistys',
    kl: 'KL3',
    items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
  },
  {
    name: 'Kutkinlaitokset ja jakokeskukset',
    kl: 'KL3',
    items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
  },
  {
    name: 'Johdot ja niiden varusteet',
    kl: 'KL3',
    items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
  },
  {
   name:'Valaisimet, lämmittimet, kojeet ja laitteet',
    kl: 'KL3',
    items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
  },
  {
    name: 'Tele- ja antennijärjestelmät',
    kl: 'KL3',
    items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
  },
  {
    name:'Palo- ja turvajärjestelmät',
    kl: 'KL3',
    items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
  },
  {
    name: 'Siirtolaitteet',
    kl: 'KL3',
    items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }],
  },
];

  useEffect(() => {
    const yhteensa = Array(11).fill(0);
    tableData.forEach(section => {
      section.items.forEach(item => {
        item.values.forEach((val, idx) => {
          const num = parseFloat(val);
          if (!isNaN(num)) yhteensa[idx] += num;
        });
      });
    });
    if (typeof onYhteensaChange === 'function') {
      onYhteensaChange([...yhteensa]);
    }
  }, [tableData, onYhteensaChange]);

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
    <div className="accordion my-4" id="rakennetekniikkaAccordion">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingRakennetekniikka">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseRakennetekniikka"
            aria-expanded="false"
            aria-controls="collapseRakennetekniikka"
          >
            Rakennetekniikka
          </button>
        </h2>

        <div
          id="collapseRakennetekniikka"
          className="accordion-collapse collapse"
          aria-labelledby="headingRakennetekniikka"
          data-bs-parent="#rakennetekniikkaAccordion"
        >
          <div className="accordion-body p-0">
            <table className="table table-sm mb-0">
              <thead className="table-light">
                <tr>
                  <th>Osa-alue</th>
                  <th>KL</th>
                  {years.map((year) => (
                    <th key={year} className="text-center">{year}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((section, sectionIdx) => (
                  <React.Fragment key={sectionIdx}>
                    <tr className="bg-secondary text-white">
                      <td colSpan={years.length + 3} className="fw-semibold d-flex justify-content-between align-items-center">
                        {section.header}
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
                            onChange={(e) => handleLabelChange(sectionIdx, itemIdx, e.target.value)}
                            className="form-control form-control-sm"
                          />
                        </td>
                                                <td style={{ minWidth: '90px' }}>
                            <select
                              value={item.kl}
                              onChange={(e) => handleKLChange(sectionIdx, itemIdx, e.target.value)}
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
                  {Array.from({ length: 11 }, (_, idx) => {
                    const colSum = tableData.reduce((sum, section) => {
                      return sum + section.items.reduce((secSum, item) => {
                        const num = parseFloat(item.values[idx]);
                        return secSum + (isNaN(num) ? 0 : num);
                      }, 0);
                    }, 0);
                    return <td key={idx} className="text-center">{colSum}</td>;
                  })}
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