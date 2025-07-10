import React, { useState } from 'react';
import { Collapse } from 'react-collapse';

export default function LVITable() {
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);

  const initialData = [
    {
      header: 'Lämmöntuotanto',
      kl: 'KL3',
      items: [
        { label: 'Lämmönjakokeskuksen uusiminen', values: [0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      ],
    },
    {
      header: 'Lämmitysverkosto',
      kl: 'KL3',
      items: [
        { label: 'Linjaventtiilien uusiminen ja verkoston tasapainotus', values: [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0] },
      ],
    },
    {
      header: 'Vesijohtoverkosto',
      kl: 'KL3',
      items: [
        { label: 'Linjaventtiilien uusiminen ja lämminkiertovesiverkoston virtaamien säätö', values: [0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0] },
      ],
    },
    {
      header: 'Ilmanvaihtojärjestelmä',
      kl: 'KL3',
      items: [
        { label: 'Iv-nuohous ja ilmamäärien säätö', values: [0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0] },
      ],
    },
  ];
 const [tableData, setTableData] = useState(initialData);

  const handleKLChange = (sectionIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].kl = value;
    setTableData(updated);
  };

  const handleValueChange = (sectionIdx, itemIdx, yearIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].values[yearIdx] = value;
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
            LVI-järjestelmät
          </button>
        </h2>

        <div
          id="collapseLVI"
          className="accordion-collapse collapse"
          aria-labelledby="headingLVI"
          data-bs-parent="#lvijarjestelmatAccordion"
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
                </tr>
              </thead>
              <tbody>
                {tableData.map((section, sectionIdx) => (
                  <React.Fragment key={sectionIdx}>
                    <tr className="bg-secondary text-white">
                      <td colSpan={years.length + 2} className="fw-semibold">{section.header}</td>
                    </tr>
                    {section.items.map((item, itemIdx) => (
                      <tr key={itemIdx}>
                        <td>{item.label}</td>
                        <td>
                          <select
                            value={section.kl}
                            onChange={(e) => handleKLChange(sectionIdx, e.target.value)}
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