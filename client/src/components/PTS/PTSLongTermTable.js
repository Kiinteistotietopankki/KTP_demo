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

export default function PTSLongTermTable() {
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
  const kiinteistotunnus = window.localStorage.getItem('selectedKiinteistotunnus');
  if (!kiinteistotunnus) return;

  const fetchPTS = async () => {
    try {
    const res = await fetch(`http://localhost:3001/api/pts/by/kiinteistotunnus/${kiinteistotunnus}`);
const data = await res.json();
const entries = Array.isArray(data.entries) ? data.entries : [];


      const getTotals = (entries) => {
        const sums = Array(11).fill(0);
        entries.forEach(e => {
          const vals = Object.values(e.values_by_year || {});
          vals.forEach((val, i) => {
            const num = parseFloat(val);
            if (!isNaN(num)) sums[i] += num;
          });
        });
        return sums;
      };

      const filterByCategory = (cat) => entries.filter(e => e.category === cat);

      const tekniikka = filterByCategory('Rakennetekniikka');
      const lvi = filterByCategory('LVI Järjestelmät');
      const sahko = filterByCategory('Sähköjärjestelmät');
      const tutkimus = filterByCategory('Lisätutkimukset');

      setTekniikkaData(tekniikka);
      setLviData(lvi);
      setSahkoData(sahko);
      setTutkimusData(tutkimus);

      setTekniikkaYhteensa(getTotals(tekniikka));
      setLviYhteensa(getTotals(lvi));
      setSahkoYhteensa(getTotals(sahko));
      setTutkimusYhteensa(getTotals(tutkimus));
    } catch (err) {
      console.error('❌ Virhe ladattaessa PTS-tietoja:', err);
    }
  };

  fetchPTS();
}, []);

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
 const flattenForPTS = (sections, category) => {
    return sections.flatMap(section =>
      (section.items || []).map(item => ({
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
  };


  const allData = [
    ...flattenForPTS(tekniikkaData, 'Rakennetekniikka'),
    ...flattenForPTS(lviData, 'LVI Järjestelmät'),
    ...flattenForPTS(sahkoData, 'Sähköjärjestelmät'),
    ...flattenForPTS(tutkimusData, 'Lisätutkimukset')
  ];

  const kiinteistotunnus = window.localStorage.getItem('selectedKiinteistotunnus');

  if (!kiinteistotunnus) {
    alert('❌ Kiinteistötunnus puuttuu!');
    return;
  }

  const payload = {
    kiinteistotunnus,
    title: 'PTS Raportti',
    created_by: 'UI',
    entries: allData
  };

  console.log("Saving payload:", JSON.stringify(payload, null, 2));

  try {
  const res = await fetch('http://localhost:3001/api/pts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});


    const result = await res.json();

    if (result.success) {
      alert('✅ PTS tallennettu onnistuneesti!');
    } else {
      throw new Error('Virhe tallennuksessa');
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
                              <td>{rowTotal}</td>
                              {item.values.map((val, yearIdx) => (
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
                        <td>YHTEENSÄ</td>
                        <td>
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
                        {Array.from({ length: 11 }, (_, idx) => {
                          const colSum = sub.items
                            .filter((i) => i.label !== 'Yhteensä')
                            .reduce((sum, item) => {
                              const num = parseFloat(item.values[idx]);
                              return !isNaN(num) ? sum + num : sum;
                            }, 0);

                          return (
                            <td key={idx} className="text-center">{colSum}</td>
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

     <div className="p-4 border-top mt-3">
  <h5 className="mb-3">Toimenpiteiden jakautuminen</h5>

  <Tabs defaultActiveKey="bar" className="mb-3" fill>
    
    {/* Pylväskaavio / BarChart */}
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

    {/* Ympyrädiagrammi / PieChart */}
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
            fill="#8884d8"
            label
          >
            <Cell fill="#ff7f50" />
            <Cell fill="#579797ff" />
            <Cell fill="#a6a837ff"/>
            <Cell fill="#8884d8" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Tab>

  </Tabs>
</div>


      <TutkimustarpeetTaulu onYhteensaChange={setTutkimusYhteensa} setData={setTutkimusData} />
      <div className="accordion-body p-0">
        <Tekniikkataulut onYhteensaChange={setTekniikkaYhteensa} setData={setTekniikkaData} />
        <LVITable onYhteensaChange={setLviYhteensa} setData={setLviData} />
        <SahkotekniikkaTable onYhteensaChange={setSahkoYhteensa} setData={setSahkoData} />
      </div>

      <div className="text-end p-4">
        <button className="btn btn-success" onClick={handleSavePTS}>
          💾 Tallenna PTS
        </button>
      </div>
    </div>
  );
}
