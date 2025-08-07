import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

import { Tabs, Tab } from 'react-bootstrap';
import Tekniikkataulut from './Tekniikkataulut';
import LVITable from './LVItaulu';
import SahkotekniikkaTable from './Sähkötekniikkataulu';
import TutkimustarpeetTaulu from './Tutkimustarpeettaulu';

export default function PTSLongTermTable({ kiinteistotunnus,onDataLoaded }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
  const years = Array.from({ length: 11 }, (_, i) => startYear + i);

  const [tekniikkaData, setTekniikkaData] = useState([]);
  const [lviData, setLviData] = useState([]);
  const [sahkoData, setSahkoData] = useState([]);
  const [tutkimusData, setTutkimusData] = useState([]);

  const [tekniikkaYhteensa, setTekniikkaYhteensa] = useState(Array(11).fill(0));
  const [lviYhteensa, setLviYhteensa] = useState(Array(11).fill(0));
  const [sahkoYhteensa, setSahkoYhteensa] = useState(Array(11).fill(0));
  const [tutkimusYhteensa, setTutkimusYhteensa] = useState(Array(11).fill(0));

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
      ],
    },
  ]);

  const handleValueChange = (catIdx, subIdx, itemIdx, yearIdx, value) => {
    const updated = [...data];
    updated[catIdx].subcategories[subIdx].items[itemIdx].values[yearIdx] = value;
    setData(updated);
  };
useEffect(() => {
  if (!kiinteistotunnus) return;

  const fetchPTS = async () => {
    try {
      const listRes = await fetch(`http://localhost:3001/api/pts/by/kiinteistotunnus/${kiinteistotunnus}`);
      const ptsList = await listRes.json();

      if (!ptsList.length) {
        console.log("ℹ️ Ei PTS-raportteja löytynyt");

        if (onDataLoaded) {
          onDataLoaded({ hasPTSData: false });
        }

        return;
      }

      const latestPTSId = ptsList[0].id;
      const fullRes = await fetch(`http://localhost:3001/api/pts/${latestPTSId}`);
      const fullPTS = await fullRes.json();

    

      const entries = fullPTS.entries || [];
      console.log("📦 Raw fetched entries:", entries);

      // Step 4: Split entries by category
      const filterByCategory = (cat) => entries.filter(e => e.category === cat);

      const tekniikka = filterByCategory('Rakennetekniikka');
      const lvi = filterByCategory('LVI Järjestelmät');
      const sahko = filterByCategory('Sähköjärjestelmät');
      const tutkimus = filterByCategory('Lisätutkimukset');
      console.log("🔧 Split entries:", {
  tekniikka, lvi, sahko, tutkimus
});

      // Step 5: Format them into state shape
    const mapToSection = (items) => {
  const grouped = {};

  items.forEach(entry => {
    const key = entry.section || 'Muu';
    if (!grouped[key]) grouped[key] = [];
let parsedValuesByYear = {};
try {
  parsedValuesByYear = typeof entry.values_by_year === 'string'
    ? JSON.parse(entry.values_by_year)
    : entry.values_by_year || {};
} catch (err) {

}
    // 🔧 Build `values[]` array from values_by_year.y1 to y11
   const values = Array.from({ length: 11 }, (_, i) => {
  const raw = parsedValuesByYear[`y${i + 1}`];
  return raw !== undefined && raw !== null ? String(raw) : '0';
});
console.log("values array for:", entry.label, values);
    grouped[key].push({
      label: entry.label || '',
      kl: entry.kl_rating || '',
      values
    });
  });

  return Object.entries(grouped).map(([section, items]) => ({
    name: section,
    items
  }));
};


      setTekniikkaData(mapToSection(tekniikka));
      setLviData(mapToSection(lvi));
      console.log("📋 Mapped LVI Data:", mapToSection(lvi));
      setSahkoData(mapToSection(sahko));
      setTutkimusData(mapToSection(tutkimus));

      // Step 6: Compute totals
  const getTotals = (entries) => {
  const sums = Array(11).fill(0);
  entries.forEach(e => {
    const source = typeof e.values_by_year === 'string'
      ? JSON.parse(e.values_by_year)
      : e.values_by_year || {};

    for (let i = 0; i < 11; i++) {
      const val = source[`y${i + 1}`];
      const num = parseFloat(val);
      if (!isNaN(num)) sums[i] += num;
    }
  });
  return sums;
};

      setTekniikkaYhteensa(getTotals(tekniikka));
      setLviYhteensa(getTotals(lvi));
      setSahkoYhteensa(getTotals(sahko));
      setTutkimusYhteensa(getTotals(tutkimus));
        if (onDataLoaded) {
        onDataLoaded({ hasPTSData: true });
      }
      console.log("✅ onDataLoaded called with: hasPTSData = true");

    } catch (err) {
      console.error("❌ Virhe ladattaessa PTS-tietoja:", err);
    }
  };

  fetchPTS();
}, [kiinteistotunnus]);


  useEffect(() => {
    const updated = [...data];
    updated.forEach((cat) => {
      if (cat.category === 'Rakennetekniikka') {
        cat.subcategories.forEach((sub) => {
          sub.items.forEach((item) => {
            if (item.label === 'Rakennetekniikka') item.values = tekniikkaYhteensa;
            if (item.label === 'LVI Järjestelmät') item.values = lviYhteensa;
            if (item.label === 'Sähköjärjestelmät') item.values = sahkoYhteensa;
          });
        });
      }
    });
    setData(updated);
  }, [tekniikkaYhteensa, lviYhteensa, sahkoYhteensa]);

  const chartData = years.map((year, idx) => {
    const sub = data[0].subcategories[0];
    const row = { year };
    sub.items.forEach(item => {
      if (item.label !== 'Yhteensä') {
        const num = parseFloat(item.values[idx]);
        row[item.label] = isNaN(num) ? 0 : num;
      }
    });
    return row;
  });

  
const handleSavePTS = async () => {
  if (!kiinteistotunnus) return;

  // Flatten helper function
  const flattenForPTS = (sections, category) =>
    sections.flatMap(section =>
      (section.items || [])
        .filter(item => {
          const hasLabel = item.label?.trim();
          const hasKL = item.kl?.trim();
          const hasValues = (item.values || []).some(v => parseFloat(v) > 0);
          return hasLabel || hasKL || hasValues;
        })
        .map(item => ({
          id: item.id || undefined, // Include `id` if present (important for PUT)
          category,
          section: section.name || section.header || '',
          label: item.label || '',
          kl_rating: item.kl || '',
          values_by_year: (item.values || []).reduce((acc, val, idx) => {
            acc[`y${idx + 1}`] = parseFloat(val) || 0;
            return acc;
          }, {}),
          metadata: {}
        }))
    );

  // Build payload
  const allData = [
    ...flattenForPTS(tekniikkaData, 'Rakennetekniikka'),
    ...flattenForPTS(lviData, 'LVI Järjestelmät'),
    ...flattenForPTS(sahkoData, 'Sähköjärjestelmät'),
    ...flattenForPTS(tutkimusData, 'Lisätutkimukset')
  ];

  const payload = {
    kiinteistotunnus,
    title: 'PTS Raportti',
    created_by: 'UI',
    entries: allData
  };

  try {
    // Step 1: Check if a PTS already exists
    const listRes = await fetch(`http://localhost:3001/api/pts/by/kiinteistotunnus/${kiinteistotunnus}`);
    const ptsList = await listRes.json();

    const existingPTS = ptsList?.[0]; // may be undefined
    const method = existingPTS ? 'PUT' : 'POST';
    const url = existingPTS
      ? `http://localhost:3001/api/pts/${existingPTS.id}`
      : 'http://localhost:3001/api/pts';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      alert('✅ PTS tallennettu onnistuneesti!');
    } else {
      throw new Error('❌ Virhe tallennuksessa');
    }
  } catch (err) {
    console.error(err);
    alert('❌ Tallennus epäonnistui');
  }
};


  return (
    <div className="accordion my-4" id="ptsAccordion">
      {data.map((cat, catIdx) => (
        <React.Fragment key={catIdx}>
          {cat.subcategories.map((sub, subIdx) => (
            <div className="accordion-item" key={subIdx}>
              <h2 className="accordion-header" id={`heading-${subIdx}`}>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${subIdx}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${subIdx}`}
                >
                  {sub.name}
                </button>
              </h2>

              <div
                id={`collapse-${subIdx}`}
                className="accordion-collapse collapse show"
                aria-labelledby={`heading-${subIdx}`}
              >
               <div className="responsive-table-container">
  <table className="table table-sm mb-0">
                    <thead className="table-light">
  <tr>
    <th className="text-start">Osa-alue</th>
    <th className="text-end font-monospace">Yhteensä</th> {/* ← Move this here */}
    {years.map((year) => (
      <th key={year} className="text-end font-monospace">{year}</th>
    ))}
  </tr>
</thead>
                    <tbody>
                      {sub.items
                        .filter((item) => item.label !== 'Yhteensä')
                        .map((item, itemIdx) => {
                          const rowTotal = item.values.reduce((sum, val) => {
                            const num = parseFloat(val);
                            return !isNaN(num) ? sum + num : sum;
                          }, 0);

                          return (
                            <tr key={itemIdx}>
  <td>{item.label}</td>
  <td className="text-end font-monospace">
    {item.values.reduce((sum, val) => {
      const num = parseFloat(val);
      return !isNaN(num) ? sum + num : sum;
    }, 0)}
  </td>

  {sub.name === 'Toimenpide-ehdotukset yhteensä'
    ? (
      item.label === 'Rakennetekniikka' ? tekniikkaYhteensa :
      item.label === 'LVI Järjestelmät' ? lviYhteensa :
      item.label === 'Sähköjärjestelmät' ? sahkoYhteensa :
      item.label === 'Lisätutkimukset' ? tutkimusYhteensa :
      item.values // fallback
    ).map((val, yearIdx) => (
      <td key={yearIdx} className="text-end">{val}</td>
    ))
    : item.values.map((val, yearIdx) => (
      <td key={yearIdx}>
        <input
          type="text"
          value={val}
          onChange={(e) =>
            handleValueChange(catIdx, subIdx, itemIdx, yearIdx, e.target.value)
          }
          className="form-control form-control-sm text-end"
        />
      </td>
    ))}
</tr>
                            
                          );
                        })}
                    </tbody>
                <tfoot>
  <tr className="table-success fw-bold">
    <td className="text-start">YHTEENSÄ</td> {/* 1: label column */}
    
    <td className="text-end font-monospace"> {/* 2: total of all row sums */}
      {sub.items
        .filter((i) => i.label !== 'Yhteensä')
        .reduce((acc, item) =>
          acc +
          item.values.reduce((sum, val) => {
            const num = parseFloat(val);
            return !isNaN(num) ? sum + num : sum;
          }, 0)
        , 0)}
    </td>

    {/* 3–13: yearly column totals */}
    {Array.from({ length: 11 }, (_, idx) => {
      const colSum = sub.items
        .filter((i) => i.label !== 'Yhteensä')
        .reduce((sum, item) => {
          const num = parseFloat(item.values[idx]);
          return !isNaN(num) ? sum + num : sum;
        }, 0);
      return (
        <td key={idx} className="text-end font-monospace">{colSum}</td>
      );
    })}
  </tr>
</tfoot>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}

   
     <TutkimustarpeetTaulu
  data={tutkimusData}
  setData={setTutkimusData}
  onYhteensaChange={setTutkimusYhteensa}
/>

<Tekniikkataulut
  data={tekniikkaData}
  setData={setTekniikkaData}
  onYhteensaChange={setTekniikkaYhteensa}
/>

<LVITable
  data={lviData}
  setData={setLviData}
  onYhteensaChange={setLviYhteensa}
/>

<SahkotekniikkaTable
  data={sahkoData}
  setData={setSahkoData}
  onYhteensaChange={setSahkoYhteensa}
/>

<div className="accordion-item">
  <h2 className="accordion-header" id="heading-charts">
    <button
      className="accordion-button collapsed"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#collapse-charts"
      aria-expanded="false"
      aria-controls="collapse-charts"
    >
      📊 Toimenpiteiden jakautuminen (Kaaviot)
    </button>
  </h2>

  <div
    id="collapse-charts"
    className="accordion-collapse collapse"
    aria-labelledby="heading-charts"
  >
    <div className="accordion-body">
      <Tabs defaultActiveKey="bar" className="mb-3" fill>

        {/* Bar Chart */}
        <Tab eventKey="bar" title="Pylväskaavio">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Rakennetekniikka" fill="#ff7f50" />
              <Bar dataKey="LVI Järjestelmät" fill="#579797ff" />
              <Bar dataKey="Sähköjärjestelmät" fill="#a6a837ff" />
              <Bar dataKey="Lisätutkimukset" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Tab>

        {/* Pie Chart */}
        <Tab eventKey="pie" title="Ympyrädiagrammi">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={[
                  { name: 'Rakennetekniikka', value: tekniikkaYhteensa.reduce((a, b) => a + b, 0) },
                  { name: 'LVI Järjestelmät', value: lviYhteensa.reduce((a, b) => a + b, 0) },
                  { name: 'Sähköjärjestelmät', value: sahkoYhteensa.reduce((a, b) => a + b, 0) },
                  { name: 'Lisätutkimukset', value: tutkimusYhteensa.reduce((a, b) => a + b, 0) }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                <Cell fill="#ff7f50" />
                <Cell fill="#579797ff" />
                <Cell fill="#a6a837ff" />
                <Cell fill="#8884d8" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Tab>
      </Tabs>
    </div>
  </div>
</div>


      <div className="text-end p-4">
        <button className="btn btn-success" onClick={handleSavePTS}>
          💾 Tallenna PTS
        </button>
      </div>
    </div>
  );
}
