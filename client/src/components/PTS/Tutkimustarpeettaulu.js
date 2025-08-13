import React, { useState, useEffect } from 'react';

export default function TutkimustarpeetTaulu({ data, onYhteensaChange, setData  }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
  const years = Array.from({ length: 11 }, (_, i) => startYear + i);

const initialData = [
  {
    header: 'Tutkimustarpeet',
    kl: 'KL3',
    items: [
      { label: '', kl: 'KL3', values: Array(11).fill('') }, 
    ]
  }
];

const handleAddRow = (sectionIdx) => {
  const updated = [...tableData];
  updated[sectionIdx].items.push({
    label: '',
    kl: 'KL3', 
    values: Array(11).fill('')
  });
  setTableData(updated);
};




  const handleValueChange = (sectionIdx, itemIdx, yearIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].values[yearIdx] = value;
    setTableData(updated);
  };



  const handleRemoveRow = (sectionIdx, itemIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.splice(itemIdx, 1);
    setTableData(updated);
  };

const [tableData, setTableData] = useState(() =>
    Array.isArray(data) && data.length > 0 ? data : initialData
  );

useEffect(() => {
  if (Array.isArray(data) && data.length > 0) {
    setTableData(data);
  }
}, [JSON.stringify(data)]);

 
  useEffect(() => {
    if (typeof setData === 'function') {
      setData(tableData);
    }
  }, [tableData, setData]);

  
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

  return (
    <div className="accordion my-4" id="tutkimusAccordion">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingTutkimus">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTutkimus"
            aria-expanded="false"
            aria-controls="collapseTutkimus"
          >
            Tutkimustarpeet
          </button>
        </h2>

        <div
          id="collapseTutkimus"
          className="accordion-collapse collapse"
          aria-labelledby="headingTutkimus"
          data-bs-parent="#tutkimusAccordion"
        >
               <div className="responsive-table-container">
                  <table className="table table-sm mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: '180px' }}>Osa-alue</th>
                  <th style={{ minWidth: '90px' }}>KL</th>
                  {years.map((year) => (
                    <th key={year} className="text-center">{year}</th>
                  ))}
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((section, sectionIdx) => (
                  <React.Fragment key={sectionIdx}>
                    <tr className="bg-success text-white">
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
