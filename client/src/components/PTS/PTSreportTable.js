import React, { useState } from 'react';

export default function PTSReportTable() {
  const [data, setData] = useState([
    {
      section: 'Kustannusten jakautuminen',
      rows: [
        {
          label: 'Kustannukset taloyhtiölle yhteensä vuosittain (x 1000€)',
          values: Array(11).fill(''),
        },
        {
          label: 'Kustannukset vuosittain €/huoneistoneliö',
          values: Array(11).fill(''),
        },
        {
          label: 'Kustannukset yhteensä 10 vuoden jaksolla',
          values: [''],
        },
      ],
    },
    {
      section: 'Tutkimustarpeet',
      rows: [
        { label: 'Parvekkeiden kuntotutkimus', values: Array(11).fill('') },
        { label: 'LVV-kuntotutkimus', values: Array(11).fill('') },
        { label: 'Väestönsuojan tiiveyskokeen suorittaminen', values: Array(11).fill('') },
        { label: 'Märkätilojen kosteuskar.', values: Array(11).fill('') },
      ],
    },
    {
      section: 'Rakennetekniikka',
      rows: [
        { label: 'Vierustat ja kuivatusosat - Salaojien uusiminen', values: Array(11).fill('') },
        { label: 'Vierustat ja kuivatusosat - Vierustojen sorastus', values: Array(11).fill('') },
      ],
    },
  ]);

  const handleValueChange = (sectionIdx, rowIdx, valueIdx, value) => {
    const newData = [...data];
    newData[sectionIdx].rows[rowIdx].values[valueIdx] = value;
    setData(newData);
  };

  return (
    <div className="space-y-8">
      {data.map((section, sIdx) => (
        <div key={sIdx}>
          <h2 className="text-xl font-bold mb-2">{section.section}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-left">Toimenpide</th>
                  {Array.from({ length: 11 }, (_, i) => (
                    <th key={i} className="border px-2 py-1">{2025 + i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="border px-2 py-1 font-medium">{row.label}</td>
                    {row.values.map((val, vIdx) => (
                      <td key={vIdx} className="border px-2 py-1">
                        <input
                          type="text"
                          className="w-full border rounded px-1 py-0.5 text-xs"
                          value={val}
                          onChange={(e) =>
                            handleValueChange(sIdx, rIdx, vIdx, e.target.value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
