import React, { useState } from 'react';
import Tekniikkataulut from './Tekniikkataulut';

export default function PTSLongTermTable() {
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);
  const [tekniikkaYhteensa, setTekniikkaYhteensa] = useState(Array(11).fill(0));

  const [data, setData] = useState([
    {
      category: 'Rakennetekniikka',
      subcategories: [
        {
          name: 'Toimenpide-ehdotukset yhteensä',
          items: [
            { label: 'Lisätutkimukset', kl: 'KL3', values: Array(11).fill('') },
            { label: 'Rakennetekniikka', kl: '', values: Array(11).fill('') },
            { label: 'LVI Järjestelmät', kl: 'KL3', values: Array(11).fill('') },
            { label: 'Sähköjärjestelmät', kl: '', values: Array(11).fill('') },
            { label: 'Yhteensä', kl: 'KL3', values: Array(11).fill('') },
          ],
        },
        {
          name: 'Kustannusten jakautuminen',
          items: [
            { label: 'Kustannukset taloyhtiölle yhteensä vuosittain (x 1000€)', kl: 'KL3', values: Array(11).fill('') },
            { label: 'Kustannukset vuosittain € / huoneistoneliö', kl: '', values: Array(11).fill('') },
            { label: 'Kustannukset yhteensä 10 vuoden jaksolla', kl: 'KL3', values: Array(11).fill('') },
            { label: 'Sähköjärjestelmät', kl: '', values: Array(11).fill('') },
            { label: 'Kohteen huoneistoala', kl: 'KL3', values: Array(11).fill('') },
            { label: 'Kertakustannus per huoneistoneliö 10v ajanjaksolla', kl: 'KL3', values: Array(11).fill('') },
          ],
        },
      ],
    },
  ]);

  const handleValueChange = (catIdx, subIdx, itemIdx, yearIdx, value) => {
    const updated = [...data];
    updated[catIdx].subcategories[subIdx].items[itemIdx].values[yearIdx] = value;
    setData(updated);
  };

  // Update "Rakennetekniikka" row with tekniikkaYhteensa
  const updatedData = data.map((cat) => {
    if (cat.category === 'Rakennetekniikka') {
      cat.subcategories.forEach((sub) => {
        sub.items.forEach((item) => {
          if (item.label === 'Rakennetekniikka') {
            item.values = tekniikkaYhteensa;
          }
        });
      });
    }
    return cat;
  });

  return (
    <div className="accordion my-4" id="ptsAccordion">

      {updatedData.map((cat, catIdx) => (
        <React.Fragment key={catIdx}>
          {cat.subcategories.map((sub, subIdx) => (
            <div className="accordion-item" key={subIdx}>
              <h2 className="accordion-header" id={`heading-${subIdx}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${subIdx}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${subIdx}`}
                >
                  {sub.name}
                </button>
              </h2>

              <div
                id={`collapse-${subIdx}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${subIdx}`}
                data-bs-parent="#ptsAccordion"
              >
                <div className="accordion-body p-0">
                  <table className="table table-sm mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Osa-alue</th>
                        <th>Yhteensä</th>
                        {years.map((year) => (
                          <th key={year} className="text-center">{year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sub.items.map((item, itemIdx) => {
                        const isYhteensa = item.label === 'Yhteensä';

                        let rowTotal = 0;
                        let colSums = Array(11).fill(0);

                        if (isYhteensa) {
                          sub.items.slice(0, itemIdx).forEach((prevItem) => {
                            prevItem.values.forEach((val, idx) => {
                              const num = parseFloat(val);
                              if (!isNaN(num)) colSums[idx] += num;
                            });
                          });
                          rowTotal = colSums.reduce((a, b) => a + b, 0);
                        } else {
                          rowTotal = item.values.reduce((sum, val) => {
                            const num = parseFloat(val);
                            return !isNaN(num) ? sum + num : sum;
                          }, 0);
                        }

                        return (
                          <tr key={itemIdx}>
                            <td>{item.label}</td>
                            <td>{rowTotal}</td>
                            {item.values.map((val, yearIdx) => (
                              <td key={yearIdx}>
                                {isYhteensa ? (
                                  <input
                                    type="text"
                                    value={colSums[yearIdx]}
                                    readOnly
                                    className="form-control form-control-sm text-end bg-light"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={(e) =>
                                      handleValueChange(catIdx, subIdx, itemIdx, yearIdx, e.target.value)
                                    }
                                    className="form-control form-control-sm text-end"
                                  />
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}

      

      
          <div className="accordion-body p-0">
            <Tekniikkataulut onYhteensaChange={setTekniikkaYhteensa} />
          </div>



    </div>
  );
}
