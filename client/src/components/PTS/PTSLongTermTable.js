import React, { useState, useEffect, useRef } from 'react';
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
import config from '../../devprodConfig';
import PiechartPTS from './PiechartPTS';
import html2canvas from 'html2canvas';

export default function PTSLongTermTable({ kiinteistotunnus, onDataLoaded, setPtsImages=null, onBackground=false}) {
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
          name: 'Yhteenvetotaulukko',
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
        const listRes = await fetch(`${config.apiBaseUrl}/api/pts/by/kiinteistotunnus/${kiinteistotunnus}`
        , {
            credentials: 'include', 
          });
        const ptsList = await listRes.json();

        if (!ptsList.length) {
          console.log("ℹ️ Ei PTS-raportteja löytynyt");

          if (onDataLoaded) {
            onDataLoaded({ hasPTSData: false });
          }

          return;
        }

        const latestPTSId = ptsList[0].id;
        const fullRes = await fetch(`${config.apiBaseUrl}/api/pts/${latestPTSId}`,
          { credentials: 'include'
        });
        const fullPTS = await fullRes.json();
        console.log(fullPTS)

      

        const entries = fullPTS.entries || [];
        // console.log("📦 Raw fetched entries:", entries);

        
        const filterByCategory = (cat) => entries.filter(e => e.category === cat);

        const tekniikka = filterByCategory('Rakennetekniikka');
        const lvi = filterByCategory('LVI Järjestelmät');
        const sahko = filterByCategory('Sähköjärjestelmät');
        const tutkimus = filterByCategory('Lisätutkimukset');
  //       console.log("🔧 Split entries:", {
  //   tekniikka, lvi, sahko, tutkimus
  // });

        
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
  // console.log("values array for:", entry.label, values);
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
        // console.log("📋 Mapped LVI Data:", mapToSection(lvi));
        setSahkoData(mapToSection(sahko));
        setTutkimusData(mapToSection(tutkimus));

        
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
            if (item.label === 'Lisätutkimukset') item.values = tutkimusYhteensa;
          });
        });
      }
    });
    setData(updated);
  }, [tekniikkaYhteensa, lviYhteensa, sahkoYhteensa, tutkimusYhteensa]);

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
          id: item.id || undefined, 
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
    // Check if a PTS already exists
    const listRes = await fetch(`${config.apiBaseUrl}/api/pts/by/kiinteistotunnus/${kiinteistotunnus}`,{ credentials: 'include'
});
    const ptsList = await listRes.json();

    const existingPTS = ptsList?.[0]; 
    const method = existingPTS ? 'PUT' : 'POST';
    const url = existingPTS
      ? `${config.apiBaseUrl}/api/pts/${existingPTS.id}`
      : `${config.apiBaseUrl}/api/pts`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
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


  const yhteensaRef = useRef(null);
  const lisatutkimuksetRef = useRef(null)
  const rakennetekniikkaRef = useRef(null)
  const lvitekniikkaRef = useRef(null)
  const sahkotekniikkaRef = useRef(null)

  const refs = [yhteensaRef, lisatutkimuksetRef, rakennetekniikkaRef, lvitekniikkaRef, sahkotekniikkaRef];

  useEffect(() => {
    if (!onBackground) return;

    console.log("Capture uef activated...")

    let resizeObserver;
    let captureTimeout;

    const captureElements = async () => {
      if (!refs.length) return;

      try {
        const images = [];
        for (const ref of refs) {
          if (!ref.current) continue;
          const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
          images.push(canvas.toDataURL("image/png"));
        }
        if (setPtsImages) setPtsImages(prev => [...prev, ...images]);
        console.log("Captured all refs as images!");
      } catch (err) {
        console.error("Error capturing elements:", err);
      }
    };

    const scheduleCapture = () => {
      if (captureTimeout) clearTimeout(captureTimeout);
      captureTimeout = setTimeout(captureElements, 6000);
    };


    console.log("Before resize observer")
    // Observe only the first ref for resize, or you can loop all
    if (yhteensaRef.current) {
      scheduleCapture();
      resizeObserver = new ResizeObserver(scheduleCapture);
      resizeObserver.observe(yhteensaRef.current);
    }
    console.log("After resize observer")

    return () => {
      if (resizeObserver && yhteensaRef.current) resizeObserver.unobserve(yhteensaRef.current);
      if (captureTimeout) clearTimeout(captureTimeout);
    };
  }, [kiinteistotunnus]);


  return (
  <div className="container-fluid mb-4">
    <div className="mx-auto w-100 w-md-100" style={{ maxWidth: '960px' }}>
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
                  <div ref={yhteensaRef}> 

                  {chartData && chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Lisätutkimukset" fill="#2F5930" stackId="a" />
                        <Bar dataKey="Rakennetekniikka" fill="#7AA668" stackId="a" />
                        <Bar dataKey="LVI Järjestelmät" fill="#A7BFA2" stackId="a" />
                        <Bar dataKey="Sähköjärjestelmät" fill="#C8D1BC" stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>No data available for the bar chart.</p>
                  )}

                  {/* Pie chart */}
                  {tekniikkaYhteensa || lviYhteensa || sahkoYhteensa || tutkimusYhteensa ? (
                    <div className='py-4'>
                      <PiechartPTS
                        tekniikkaYhteensa={tekniikkaYhteensa}
                        lviYhteensa={lviYhteensa}
                        sahkoYhteensa={sahkoYhteensa}
                        tutkimusYhteensa={tutkimusYhteensa}
                      />
                    </div>
                  ) : (
                    <p>No data available for the pie chart.</p>
                  )}

                    <div className="table-responsive ptstaulut">
                      <table className="table table-sm table-borderless table-striped mb-0">

                        {/* Green header */}
                        <thead>
                          <tr>
                            <th colSpan={years.length + 2} className="bg-success text-white p-2">
                              <div className="d-flex justify-content-between">
                                <div className="fw-bold">Toimenpide-ehdotukset yhteensä</div>
                                <div className="small text-end">Kustannusarvio (x 1000€) Kustannustaso 2025 sis. Alv 25,5%</div>
                              </div>
                            </th>
                          </tr>
                        </thead>

                        {/* Column headers */}
                        <thead>
                          <tr>
                            <th className="bg-success text-white text-start">Osa-alue</th>
                            <th className="bg-success text-white text-center">Yhteensä</th>
                            {years.map((year) => (
                              <th key={year} className="bg-success text-white text-center px-2 fw-normal">{year}</th>
                            ))}
                          </tr>
                        </thead>

                        {/* Table body */}
                        <tbody>
                          {sub.items
                            .filter((item) => item.label !== 'Yhteensä')
                            .map((item, itemIdx) => {
                              const rowTotal = item.values.reduce((sum, val) => {
                                const num = parseFloat(val);
                                return !isNaN(num) ? sum + num : sum;
                              }, 0);

                              const valuesToShow =
                                sub.name === 'Yhteenvetotaulukko'
                                  ? item.label === 'Rakennetekniikka'
                                    ? tekniikkaYhteensa
                                    : item.label === 'LVI Järjestelmät'
                                    ? lviYhteensa
                                    : item.label === 'Sähköjärjestelmät'
                                    ? sahkoYhteensa
                                    : item.label === 'Lisätutkimukset'
                                    ? tutkimusYhteensa
                                    : item.values
                                  : item.values;

                              return (
                                <tr key={itemIdx}>
                                  <td className="text-start">{item.label}</td>
                                  <td className="text-center font-monospace">{rowTotal}</td>
                                  {valuesToShow.map((val, yearIdx) => (
                                    <td key={yearIdx} className="text-center px-2">
                                      {sub.name === 'Yhteenvetotaulukko' ? (
                                        val
                                      ) : (
                                        <input
                                          type="text"
                                          value={val}
                                          onChange={(e) =>
                                            handleValueChange(catIdx, subIdx, itemIdx, yearIdx, e.target.value)
                                          }
                                          className="form-control form-control-sm text-center"
                                        />
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                        </tbody>

                        {/* Footer totals */}
                        <tfoot>
                          <tr className="fw-bold">
                            <td className="bg-success text-white text-start">YHTEENSÄ</td>
                            <td className="bg-success text-white text-center font-monospace">
                              {sub.items
                                .filter((i) => i.label !== 'Yhteensä')
                                .reduce(
                                  (acc, item) =>
                                    acc +
                                    item.values.reduce((sum, val) => {
                                      const num = parseFloat(val);
                                      return !isNaN(num) ? sum + num : sum;
                                    }, 0),
                                  0
                                )}
                            </td>
                            {Array.from({ length: years.length }, (_, idx) => {
                              const colSum = sub.items
                                .filter((i) => i.label !== 'Yhteensä')
                                .reduce((sum, item) => {
                                  const num = parseFloat(item.values[idx]);
                                  return !isNaN(num) ? sum + num : sum;
                                }, 0);

                              return (
                                <td key={idx} className="bg-success text-white text-center font-monospace px-2">
                                  {colSum}
                                </td>
                              );
                            })}
                          </tr>
                        </tfoot>
                      </table>
                    </div>
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
            ref={lisatutkimuksetRef}
          />

          <Tekniikkataulut
            data={tekniikkaData}
            setData={setTekniikkaData}
            onYhteensaChange={setTekniikkaYhteensa}
            type={'Rakennetekniikka'}
            ref={rakennetekniikkaRef}
          />

          <Tekniikkataulut
            data={lviData}
            setData={setLviData}
            onYhteensaChange={setLviYhteensa}
            type={'LVI-tekniikka'}
            ref={lvitekniikkaRef}
          />

          <Tekniikkataulut
            data={sahkoData}
            setData={setSahkoData}
            onYhteensaChange={setSahkoYhteensa}
            type={'Sähkötekniikka'}
            ref={sahkotekniikkaRef}
          />

          <div className="text-end p-4">
            <button className="btn btn-success" onClick={handleSavePTS}>
              💾 Tallenna PTS
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}