import React, { useState, useEffect } from 'react';

export default function Tekniikkataulut({onYhteensaChange}) {
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);

  const initialData = [
    {
      header: 'Vierustat ja kuivatusosat',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Pihapäällysteet',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Aluevarusteet ja -rakenteet',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Perustukset ja sokkelit',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Alapohja',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Rakennusrunko',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Ulkoseinät',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Ulkoseinät',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Ulko-ovet',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Parvekkeet',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Kattorakenteet',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Sisätilat',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
    {
      header: 'Märkätilat',
      kl: 'KL3',
      items: [
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
        { label: '', values: Array(11).fill('') },
      ]
    },
  ];

  const [tableData, setTableData] = useState(initialData);

  const handleKlChange = (index, value) => {
    const updated = [...tableData];
    updated[index].kl = value;
    setTableData(updated);
  };

  const handleLabelChange = (headerIndex, itemIndex, value) => {
    const updated = [...tableData];
    updated[headerIndex].items[itemIndex].label = value;
    setTableData(updated);
  };

  const handleYearValueChange = (headerIndex, itemIndex, yearIndex, value) => {
    const updated = [...tableData];
    updated[headerIndex].items[itemIndex].values[yearIndex] = value;
    setTableData(updated);
  };

  const handleAddRow = (headerIndex) => {
    const updated = [...tableData];
    updated[headerIndex].items.push({ label: '', values: Array(11).fill('') });
    setTableData(updated);
  };

  const handleRemoveRow = (headerIndex, itemIndex) => {
    const updated = [...tableData];
    updated[headerIndex].items.splice(itemIndex, 1);
    setTableData(updated);
  };

  // Calculate grand total
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
    if (onYhteensaChange) onYhteensaChange(yhteensa);
  }, [yhteensa, onYhteensaChange]);

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
                  {years.map(year => (
                    <th key={year} className="text-center">{year}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((section, headerIndex) => (
                  <React.Fragment key={headerIndex}>
                    <tr className="bg-secondary text-white">
                      <td colSpan={years.length + 3} className="fw-semibold">{section.header}</td>
                    </tr>

                    {section.items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleLabelChange(headerIndex, itemIndex, e.target.value)}
                            className="form-control form-control-sm"
                          />
                        </td>
                        <td>
                          <select
                            value={section.kl}
                            onChange={(e) => handleKlChange(headerIndex, e.target.value)}
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
                                handleYearValueChange(headerIndex, itemIndex, yearIdx, e.target.value)
                              }
                              className="form-control form-control-sm text-end"
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            onClick={() => handleRemoveRow(headerIndex, itemIndex)}
                            className="btn btn-sm btn-danger"
                            title="Remove row"
                          >×</button>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={years.length + 3} className="text-center">
                        <button
                          onClick={() => handleAddRow(headerIndex)}
                          className="btn btn-sm btn-outline-success"
                        >
                          + Lisää rivi
                        </button>
                      </td>
                    </tr>
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