import React, { useState } from 'react';

export default function Tekniikkataulut() {
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

  // ✅ Calculate grand yhteensä row
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
    <div className="overflow-x-auto mt-4 text-black">
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-green-700 font-bold text-black">
            <th className="border px-2 py-1 font-bold">Osa-alue</th>
            <th className="border px-2 py-1 font-bold">KL</th>
            {years.map((year) => (
              <th key={year} className="border px-2 py-1 text-center font-bold">{year}</th>
            ))}
            <th className="border px-2 py-1 font-bold"></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((section, headerIndex) => (
            <React.Fragment key={headerIndex}>
              {/* STATIC HEADER ROW */}
              <tr className="bg-gray-100">
                <td className="border px-2 py-1 uppercase font-bold text-black">
                  {section.header}
                </td>
                <td className="text-black font-bold">
                  <select
                    value={section.kl}
                    onChange={(e) => handleKlChange(headerIndex, e.target.value)}
                    className="border rounded px-1 py-0.5 text-xs"
                  >
                    <option value="KL1">KL1</option>
                    <option value="KL2">KL2</option>
                    <option value="KL3">KL3</option>
                    <option value="KL4">KL4</option>
                    <option value="KL5">KL5</option>
                  </select>
                </td>
                {years.map((_, i) => (
                  <td key={i} className="border px-2 py-1"></td>
                ))}
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => handleAddRow(headerIndex)}
                    className="text-green-700 text-lg"
                    title="Add row"
                  >
                    +
                  </button>
                </td>
              </tr>

              {/* ALIOTSIKOT INPUT ROWS */}
              {section.items.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleLabelChange(headerIndex, itemIndex, e.target.value)}
                      className="w-full px-1 py-0.5 text-xs border rounded"
                    />
                  </td>
                  <td className="border px-2 py-1"></td>
                  {item.values.map((val, yearIdx) => (
                    <td key={yearIdx} className="border px-2 py-1">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          handleYearValueChange(headerIndex, itemIndex, yearIdx, e.target.value)
                        }
                        className="w-full px-1 py-0.5 text-xs border rounded"
                      />
                    </td>
                  ))}
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleRemoveRow(headerIndex, itemIndex)}
                      className="text-red-500 text-lg"
                      title="Remove row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}

          {/* ✅ GRAND YHTEENSÄ ROW */}
          <tr className="bg-gray-200 font-semibold">
            <td className="border px-2 py-1">YHTEENSÄ</td>
            <td className="border px-2 py-1"></td>
            {yhteensa.map((sum, idx) => (
              <td key={idx} className="border px-2 py-1">
                {sum}
              </td>
            ))}
            <td className="border px-2 py-1"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}