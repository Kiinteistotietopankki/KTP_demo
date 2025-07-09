import React, { useState } from 'react';
import Tekniikkataulut from './Tekniikkataulut';

export default function PTSLongTermTable() {
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);

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
          name: 'Kustannusten jakautuminen ',
          items: [
            { label: 'Kustannukset taloyhtiölle yhteensä vuosittain (x 1000€)', kl: 'KL3', values: Array(11).fill('') },
            { label: 'Kustannukset vuosittain € / huoneistoneliö', kl: '', values: Array(11).fill('') },
            { label: 'Kustannukset yhteensä 10 vuoden jaksolla ', kl: 'KL3', values: Array(11).fill('') },
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

  return (
    <div className="space-y-8 overflow-x-auto">
      {data.map((cat, catIdx) => (
        <div key={catIdx}>
          <h2 className="text-2xl font-bold bg-green-700 text-white p-2">{cat.category}</h2>

          {cat.subcategories.map((sub, subIdx) => (
            <div key={subIdx}>
              <h3 className="text-lg font-semibold mt-4 mb-2">{sub.name}</h3>

              <table className="min-w-full text-sm border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1"></th>
                    <th className="border px-2 py-1">Yhteensä</th>
                    {years.map((year) => (
                      <th key={year} className="border px-2 py-1">{year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sub.items.map((item, itemIdx) => {
                    const isYhteensa = item.label === 'Yhteensä';
                    const isHuoneistoala = item.label === 'Kohteen huoneistoala';

                    let rowTotal = 0;
                    let colSums = Array(11).fill(0);

                    if (isYhteensa) {
                      sub.items.slice(0, itemIdx).forEach(prevItem => {
                        prevItem.values.forEach((val, idx) => {
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            colSums[idx] += num;
                          }
                        });
                      });
                      rowTotal = colSums.reduce((a, b) => a + b, 0);
                    } else if (!isHuoneistoala) {
                      rowTotal = item.values.reduce((sum, val) => {
                        const num = parseFloat(val);
                        return !isNaN(num) ? sum + num : sum;
                      }, 0);
                    }

                    return (
                      <tr key={itemIdx}>
                        <td className="border px-2 py-1">{item.label}</td>
                        <td className="border px-2 py-1">{rowTotal}</td>

                        {isHuoneistoala ? (
                          <td colSpan={years.length} className="border px-2 py-1">
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={item.values[0]}
                                onChange={(e) => {
                                  const updated = [...data];
                                  updated[catIdx].subcategories[subIdx].items[itemIdx].values[0] = e.target.value;
                                  setData(updated);
                                }}
                                className="w-24 px-1 py-0.5 text-xs border rounded"
                              />
                              <span className="ml-2">m²</span>
                            </div>
                          </td>
                        ) : (
                          item.values.map((val, yearIdx) => (
                            <td key={yearIdx} className="border px-2 py-1">
                              {isYhteensa ? (
                                <input
                                  type="text"
                                  value={colSums[yearIdx]}
                                  readOnly
                                  className="w-full px-1 py-0.5 text-xs border rounded bg-gray-200"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) =>
                                    handleValueChange(catIdx, subIdx, itemIdx, yearIdx, e.target.value)
                                  }
                                  className="w-full px-1 py-0.5 text-xs border rounded"
                                />
                              )}
                            </td>
                          ))
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}

      {/* Insert Tekniikkataulut below */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold bg-green-700 text-white p-2">Tekniikkataulut</h2>
        <Tekniikkataulut />
      </div>
    </div>
  );
}
