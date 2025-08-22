import React, { useState, useEffect, forwardRef } from 'react';
import { getLabelsByCategoryAndSection } from '../../api/api.js'

const TutkimustarpeetTaulu = forwardRef(({ data, onYhteensaChange, setData, savepts }, ref) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
  const years = Array.from({ length: 11 }, (_, i) => startYear + i);

  const initialData = [
    { header: 'Tutkimustarpeet', items: [{ label: '', values: Array(11).fill('') }] },
  ];

  const [tableData, setTableData] = useState(() => (Array.isArray(data) && data.length > 0 ? data : initialData));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) setTableData(data);
  }, [JSON.stringify(data)]);

  useEffect(() => { if (typeof setData === 'function') setData(tableData); }, [tableData, setData]);

  const handleAddRow = (sectionIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.push({ label: '', values: Array(11).fill('') });
    setTableData(updated);
  };

  const handleRemoveRow = (sectionIdx, itemIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.splice(itemIdx, 1);
    setTableData(updated);
  };

  const handleValueChange = (sectionIdx, itemIdx, yearIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].values[yearIdx] = value;
    setTableData(updated);
  };

  const yhteensa = Array(11).fill(0);
  tableData.forEach(section => section.items.forEach(item =>
    item.values.forEach((val, idx) => {
      const num = parseFloat(val);
      if (!isNaN(num)) yhteensa[idx] += num;
    })
  ));

  const [labelsBySection, setLabelsBySection] = useState({});

  useEffect(() => {
    if (!isEditing) return;

    let isMounted = true;

    const fetchLabels = async () => {
      try {
        const result = await getLabelsByCategoryAndSection("Lisätutkimukset", "Tutkimustarpeet");
        if (!isMounted) return;

        // Use the section name from the API as the key
        setLabelsBySection({ [result.data.searchedSection]: result.data.labels });
      } catch (err) {
        console.error(err);
      }
    };

    fetchLabels();

    return () => { isMounted = false; };
  }, [isEditing]);

  useEffect(() => { if (onYhteensaChange) onYhteensaChange([...yhteensa]); }, [JSON.stringify(yhteensa)]);

  return (
    <div className="my-4 ptstaulut">

      <div className="text-center mb-2">
        <button
          className="btn btn-sm btn-success"
          onClick={() => {
            if (isEditing && typeof savepts === 'function') {
              savepts(tableData); // call the save function
            }
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Tallenna' : 'Muokkaa'}
        </button>
      </div>



      <div className="table-responsive" ref={ref}>
        <table className="table table-sm table-borderless table-striped mb-0">
          {/* Green header */}
          <thead>
            <tr>
              <th colSpan={years.length + 1} className="bg-success text-white p-2">
                <div className="d-flex justify-content-between">
                  <div className="fw-bold"></div>
                  {!isEditing && <div className="small text-end">Kustannusarvio (x 1000€) Kustannustaso 2025 sis. Alv 25,5%</div>}
                </div>
              </th>
            </tr>
          </thead>

          {/* Column headers */}
          <thead>
            <tr>
              <th className="bg-success text-white text-start">Tutkimustarpeet</th>
              {years.map((year) => (
                <th key={year} className="bg-success text-white text-center px-2 fw-normal">{year}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData.map((section, sectionIdx) => (
              <React.Fragment key={sectionIdx}>
                {section.items.map((item, itemIdx) => (
                  (() => {
                    return (
                      <tr key={itemIdx}>
                        <td className="text-start">
                          {isEditing ? (
                            <div style={{ display: 'inline-block', position: 'relative' }}>
                              <input
                                type="text"
                                list={`labels-${sectionIdx}-${itemIdx}`}
                                value={item.label || ""}
                                onChange={e => {
                                  const updated = [...tableData];
                                  updated[sectionIdx].items[itemIdx].label = e.target.value;
                                  setTableData(updated);
                                }}
                                className="form-control form-control-sm"
                                placeholder="Freewrite or select..."
                                style={{ width: 'auto', minWidth: '50px', transition: 'width 0.2s ease' }}
                                onFocus={e => {
                                  const span = document.createElement('span');
                                  span.style.visibility = 'hidden';
                                  span.style.whiteSpace = 'pre';
                                  span.style.font = window.getComputedStyle(e.target).font;
                                  span.innerText = e.target.value || ' ';
                                  document.body.appendChild(span);
                                  e.target.style.width = `${span.offsetWidth + 30}px`;
                                  document.body.removeChild(span);
                                }}
                                onInput={e => {
                                  const span = document.createElement('span');
                                  span.style.visibility = 'hidden';
                                  span.style.whiteSpace = 'pre';
                                  span.style.font = window.getComputedStyle(e.target).font;
                                  span.innerText = e.target.value || ' ';
                                  document.body.appendChild(span);
                                  e.target.style.width = `${span.offsetWidth + 30}px`;
                                  document.body.removeChild(span);
                                }}
                                onBlur={e => e.target.style.width = '150px'}
                              />
                              <datalist id={`labels-${sectionIdx}-${itemIdx}`}>
                                {(labelsBySection["Tutkimustarpeet"] || []).map((labelOption, idx) => (
                                  <option key={idx} value={labelOption} />
                                ))}
                              </datalist>
                            </div>
                          ) : (
                            <div className="" style={{ whiteSpace: 'pre-wrap' }}>
                              {item.label}
                            </div>
                          )}
                        </td>

                        

                    {item.values.map((val, yearIdx) => (
                      <td key={yearIdx} className="text-center px-1 px-sm-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={val}
                            onChange={e => handleValueChange(sectionIdx, itemIdx, yearIdx, e.target.value)}
                            className={`form-control form-control-sm text-center ${val && Number(val) > 0 ? 'bg-success text-white' : ''}`}
                          />
                        ) : val === 0 || val === '0' ? '' : val}
                      </td>
                    ))}

                        {isEditing && (
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveRow(sectionIdx, itemIdx)}
                            >
                              ×
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })()
                ))}

                {isEditing && (
                  <tr key="add-row">
                    <td colSpan={years.length + 1} className="text-start">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleAddRow(sectionIdx)}
                      >
                        Lisää rivi
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>

          <tfoot>
            <tr className="fw-bold">
              <td className="bg-success text-white text-start">YHTEENSÄ</td>
              {yhteensa.map((sum, idx) => (
                <td key={idx} className="bg-success text-white text-center font-monospace px-2">{sum}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
})

export default TutkimustarpeetTaulu;
