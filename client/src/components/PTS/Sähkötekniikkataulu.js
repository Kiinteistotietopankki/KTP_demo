import React, { useState, useEffect } from 'react';

export default function SahkotekniikkaTable({ onYhteensaChange, setData }) {
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth(); // 0 = Tammikuu ja  6 = heinäkuu
const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
const years = Array.from({ length: 11 }, (_, i) => startYear + i);

  const [tableData, setTableData] = useState([
    {
      header: 'Aluesähköistys',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
       
      ],
    },
    {
      header: 'Kutkinlaitokset ja jakokeskukset',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
      ],
    },
    {
      header: 'Johdot ja niiden varusteet',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
      ],
    },
    {
      header: 'Valaisimet, lämmittimet, kojeet ja laitteet',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
      ],
    },
    {
      header: 'Tele- ja antennijärjestelmät',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
      ],
    },
    {
      header: 'Palo- ja turvajärjestelmät',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
      ],
    },
    {
      header: 'Siirtolaitteet',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
      ],
    },
    
    
  ]);

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

  const handleKlChange = (sectionIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].kl = value;
    setTableData(updated);
  };

  const handleAddRow = (sectionIdx) => {
  const updated = [...tableData];
  updated[sectionIdx].items.push({
    label: '',
    kl: '', // 👈 add this line
    values: Array(11).fill('')
  });
  setTableData(updated);
};

  const handleRemoveRow = (sectionIdx, itemIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.splice(itemIdx, 1);
    setTableData(updated);
  };

  
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
    onYhteensaChange([...yhteensa]); 
  }
  
}, [JSON.stringify(yhteensa)]);
  useEffect(() => {
    if (typeof setData === 'function') setData(tableData);
  }, [tableData]);

  return (
    <div className="accordion my-4" id="sahkotekniikkaAccordion">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingSahko">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseSahko"
            aria-expanded="false"
            aria-controls="collapseSahko"
          >
            Sähkötekniikka
          </button>
        </h2>

        <div
          id="collapseSahko"
          className="accordion-collapse collapse"
          aria-labelledby="headingSahko"
          data-bs-parent="#sahkotekniikkaAccordion"
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
                            className="form-control form-control-sm"
                            value={item.label}
                            onChange={(e) => handleLabelChange(sectionIdx, itemIdx, e.target.value)}
                          />
                        </td>
                        <td style={{ minWidth: '90px' }}>
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
                              className="form-control form-control-sm text-end"
                              value={val}
                              onChange={(e) =>
                                handleValueChange(sectionIdx, itemIdx, yearIdx, e.target.value)
                              }
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveRow(sectionIdx, itemIdx)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                
                <tr className="table-success fw-bold">
                  <td>YHTEENSÄ</td>
                  <td></td>
                  {yhteensa.map((sum, idx) => (
                    <td key={idx} className="text-center">{sum}</td>
                  ))}
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
