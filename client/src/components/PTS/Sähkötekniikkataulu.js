import React, { useState } from 'react';

export default function SahkotekniikkaTable() {
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);

  const [tableData, setTableData] = useState([
    {
      header: 'Aluesähköistys',
      kl: 'KL3',
      items: [
        { label: 'Ulkovalaistuksen uusiminen', values: Array(11).fill('') },
      ],
    },
    {
      header: 'Valaisimet',
      kl: 'KL3',
      items: [
        { label: 'Sisävalaisimien uusiminen', values: Array(11).fill('') },
      ],
    },
  ]);

  const handleLabelChange = (sectionIdx, itemIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].label = value;
    setTableData(updated);
  };

  const handleValueChange = (sectionIdx, itemIdx, yearIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].values[yearIdx] = value;
    setTableData(updated);
  };

  // Calculate yhteensä
  const yhteensa = Array(11).fill(0);
  tableData.forEach(section => {
    section.items.forEach(item => {
      item.values.forEach((val, idx) => {
        const num = parseFloat(val);
        if (!isNaN(num)) yhteensa[idx] += num;
      });
    });
  });

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
                  <th>Aliotsikko</th>
                  <th>KL</th>
                  {years.map((year) => (
                    <th key={year} className="text-center">{year}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tableData.map((section, sectionIdx) => (
                  <React.Fragment key={sectionIdx}>
                    <tr className="bg-secondary text-white">
                      <td colSpan={years.length + 2} className="fw-semibold">
                        {section.header}
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
                        <td>{section.kl}</td>
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
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
