import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar,
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
import ToastMessage from '../ToastMessage';

export default function PTSLongTermTable({ kiinteistotunnus, onDataLoaded, imports, onSectionsChange, setPtsImages = null, onBackground = false }) {
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

 
  const mergeImports = (prevSections = [], cat) => {
    const catImports = (imports || []).filter(x => x.category === cat);
    if (catImports.length === 0) return prevSections;

    const next = prevSections.map(s => ({ ...s, items: [...(s.items || [])] }));

    catImports.forEach(imp => {
      const secName = (imp.section || '').trim() || 'Muu';
      const label = (imp.label || '').trim();
      if (!label) return;

      let idx = next.findIndex(s => (s.name || s.header) === secName);
      if (idx === -1) {
        next.push({ name: secName, items: [] });
        idx = next.length - 1;
      }

      const exists = next[idx].items?.some(it => (it.label || '').trim() === label);
      if (!exists) {
        (next[idx].items ||= []).push({
          label,
          kl: imp.kl || 'KL3',
          values: Array(11).fill(''),
        });
      }
    });

    return next;
  };

 
  useEffect(() => {
    if (!imports) return;
    setTekniikkaData(prev => mergeImports(prev, 'Rakennetekniikka'));
    setLviData(prev => mergeImports(prev, 'LVI Järjestelmät'));
    setSahkoData(prev => mergeImports(prev, 'Sähköjärjestelmät'));
    setTutkimusData(prev => mergeImports(prev, 'Lisätutkimukset'));
  }, [JSON.stringify(imports)]);
const handleValueChange = (catIdx, subIdx, itemIdx, yearIdx, value) => {
  const updated = [...data];
  updated[catIdx].subcategories[subIdx].items[itemIdx].values[yearIdx] = value;
  setData(updated);
};
  
  useEffect(() => {
    if (!kiinteistotunnus) return;

    const fetchPTS = async () => {
      try {
        const listRes = await fetch(`${config.apiBaseUrl}/api/pts/by/kiinteistotunnus/${kiinteistotunnus}`, {
          credentials: 'include',
        });
        const ptsList = await listRes.json();

        if (!ptsList.length) {
          if (onDataLoaded) onDataLoaded({ hasPTSData: false });
          return;
        }

        const latestPTSId = ptsList[0].id;
        const fullRes = await fetch(`${config.apiBaseUrl}/api/pts/${latestPTSId}`, {
          credentials: 'include',
        });
        const fullPTS = await fullRes.json();

        const entries = fullPTS.entries || [];
        const filterByCategory = (cat) => entries.filter(e => e.category === cat);

        const tekniikka = filterByCategory('Rakennetekniikka');
        const lvi = filterByCategory('LVI Järjestelmät');
        const sahko = filterByCategory('Sähköjärjestelmät');
        const tutkimus = filterByCategory('Lisätutkimukset');

       const mapToSection = (items, defaultName) => {
  if (!items.length) {
    return [{ name: defaultName, items: [] }];  
  }

  const grouped = {};
  items.forEach(entry => {
    const key = entry.section || 'Muu';
    if (!grouped[key]) grouped[key] = [];
    let parsedValuesByYear = {};
    try {
      parsedValuesByYear = typeof entry.values_by_year === 'string'
        ? JSON.parse(entry.values_by_year)
        : entry.values_by_year || {};
    } catch {}
    const values = Array.from({ length: 11 }, (_, i) => {
      const raw = parsedValuesByYear[`y${i + 1}`];
      return raw !== undefined && raw !== null ? String(raw) : '0';
    });
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

        // 👇 merge imports directly after mapping backend
     setTekniikkaData(mergeImports(mapToSection(tekniikka, "Rakennetekniikka"), "Rakennetekniikka"));
    setLviData(mergeImports(mapToSection(lvi, "LVI Järjestelmät"), "LVI Järjestelmät"));
    setSahkoData(mergeImports(mapToSection(sahko, "Sähköjärjestelmät"), "Sähköjärjestelmät"));
    setTutkimusData(mergeImports(mapToSection(tutkimus, "Lisätutkimukset"), "Lisätutkimukset"));

        if (onDataLoaded) onDataLoaded({ hasPTSData: true });

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
 useEffect(() => {   if (!onSectionsChange) return;
   const pick = (arr = []) => arr.map(s => s.name || s.header).filter(Boolean);
   onSectionsChange({
     'Rakennetekniikka': pick(tekniikkaData),
     'LVI Järjestelmät': pick(lviData),
     'Sähköjärjestelmät': pick(sahkoData),
     'Lisätutkimukset': pick(tutkimusData),
   });  }, [tekniikkaData, lviData, sahkoData, tutkimusData, onSectionsChange]);
  
  const [toast, setToast] = useState({ show: false, message: '', bg: 'success' });

  const handleSavePTS = async () => {
    if (!kiinteistotunnus) return;

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
      const listRes = await fetch(`${config.apiBaseUrl}/api/pts/by/kiinteistotunnus/${kiinteistotunnus}`, {
        credentials: 'include'
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
        setToast({ show: true, message: '✅ PTS tallennettu onnistuneesti!', bg: 'success' });
      } else {
        throw new Error('❌ Virhe tallennuksessa');
      }
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: '❌ Tallennus epäonnistui', bg: 'danger' });
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
      captureTimeout = setTimeout(captureElements, 8000);
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
        <ToastMessage
          show={toast.show}
          message={toast.message}
          bg={toast.bg}
          onClose={() => setToast({ ...toast, show: false })}
        />
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
            savepts={handleSavePTS}
            ref={lisatutkimuksetRef}
          />

          <Tekniikkataulut
            data={tekniikkaData}
            setData={setTekniikkaData}
            onYhteensaChange={setTekniikkaYhteensa}
            type={'Rakennetekniikka'}
            savepts={handleSavePTS}
            ref={rakennetekniikkaRef}
          />

          <Tekniikkataulut
            data={lviData}
            setData={setLviData}
            onYhteensaChange={setLviYhteensa}
            type={'LVI-tekniikka'}
            savepts={handleSavePTS}
            ref={lvitekniikkaRef}
          />

          <Tekniikkataulut
            data={sahkoData}
            setData={setSahkoData}
            onYhteensaChange={setSahkoYhteensa}
            type={'Sähkötekniikka'}
            savepts={handleSavePTS}
            ref={sahkotekniikkaRef}
            imports={(imports || []).filter(x => x.category === 'Sähköjärjestelmät')}
          />

        </div>
      </div>
    </div>
  );

}