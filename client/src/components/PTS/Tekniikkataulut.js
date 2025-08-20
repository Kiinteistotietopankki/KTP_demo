import React, { useState, useEffect, forwardRef } from 'react';

const Tekniikkataulut = forwardRef(({ data, setData, onYhteensaChange, type }, ref) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
  const years = Array.from({ length: 11 }, (_, i) => startYear + i);

  let initialData;

  if (type === 'Sähkötekniikka') {
    initialData = [
      { name: 'Aluesähköistys', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Kytkinlaitokset ja jakokeskukset', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Johdot ja niiden varusteet', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Valaisimet, lämmittimet, kojeet ja laitteet', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Tele- ja antennijärjestelmät', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Palo- ja turvajärjestelmät', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Siirtolaitteet', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
    ];
  } else if (type === 'LVI-tekniikka') {
    initialData = [
      { name: 'Lämmöntuotanto', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Lämmitysverkosto', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Vesijohtoverkosto', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Viemäriverkosto', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Ilmanvaihtojärjestelmä', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Jäähdytysjärjestelmät', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Rakennusautomaatio', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Muut järjestelmät', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
    ];
  } else if (type === 'Rakennetekniikka') {
    initialData = [
      { name: 'Vierustat ja kuivatusosat', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Pihapäällysteet', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Aluevarusteet ja -rakenteet', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Perustukset ja sokkelit', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Alapohja', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Rakennusrunko', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Ulkoseinät', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Ikkunat', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Ulko-ovet', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Parvekkeet', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Kattorakenteet', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Sisätilat', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
      { name: 'Märkätilat', kl: 'KL3', items: [{ label: '', kl: 'KL3', values: Array(11).fill('') }] },
    ];
  }

  const [tableData, setTableData] = useState(() => (Array.isArray(data) && data.length > 0 ? data : initialData));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) setTableData(data);
  }, [JSON.stringify(data)]);

  useEffect(() => {
    if (typeof setData === 'function') setData(tableData);
  }, [tableData, setData]);

  const handleValueChange = (sectionIdx, itemIdx, yearIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].values[yearIdx] = value;
    setTableData(updated);
  };

  const handleLabelChange = (sectionIdx, itemIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].label = value;
    setTableData(updated);
  };

  const handleKLChange = (sectionIdx, itemIdx, value) => {
    const updated = [...tableData];
    updated[sectionIdx].items[itemIdx].kl = value;
    setTableData(updated);
  };

  const handleAddRow = (sectionIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.push({ label: '', kl: 'KL3', values: Array(11).fill('') });
    setTableData(updated);
  };

  const handleRemoveRow = (sectionIdx, itemIdx) => {
    const updated = [...tableData];
    updated[sectionIdx].items.splice(itemIdx, 1);
    setTableData(updated);
  };

  const yhteensa = Array(11).fill(0);
  tableData.forEach(section => section.items.forEach(item =>
    item.values.forEach((val, idx) => {
      const num = parseFloat(val);
      if (!isNaN(num)) yhteensa[idx] += num;
    })
  ));

  function getKLColor(kl) {
    switch (kl) {
      case 'KL1':
      case 'KL2':
        return '#ba3b46'; // red
      case 'KL3':
        return '#d0c407'; // yellow
      case 'KL4':
      case 'KL5':
        return '#04aa00'; // green
      default:
        return 'black';
    }
  }

  useEffect(() => { if (onYhteensaChange) onYhteensaChange([...yhteensa]); }, [JSON.stringify(yhteensa)]);

  return (
    <div className="my-4 ptstaulut">

      {/* Edit button */}
      <div className="text-center mb-2">
        <button
          className="btn btn-sm btn-success"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Tallenna' : 'Muokkaa'}
        </button>
      </div>

      <div className="table-responsive" ref={ref}>
        <table className="table table-sm table-borderless mb-0">
          <thead>
            <tr>
              <th colSpan={years.length + 2 + (isEditing ? 1 : 0)} className="bg-success text-white p-2">
                <div className="d-flex justify-content-between">
                  <div className="fw-bold"></div>
                  {!isEditing && <div className="small text-end">Kustannusarvio (x 1000€) Kustannustaso 2025 sis. Alv 25,5%</div>}
                </div>
              </th>
            </tr>
          </thead>

          <thead>
            <tr>
              <th className="bg-success text-white text-start">{type}</th>
              <th className="bg-success text-white text-center">KL</th>
              {years.map(year => (
                <th key={year} className="bg-success text-white text-center px-2">{year}</th>
              ))}
              {isEditing && <th className="bg-success text-white"></th>}
            </tr>
          </thead>

          <tbody>
            {tableData.map((section, sectionIdx) => (
              <React.Fragment key={sectionIdx}>
              <tr>
                <td
                  colSpan={years.length + 2 + (isEditing ? 1 : 0)}
                  className="bg-light fw-semibold text-dark p-2"
                >
                  <div className="justify-content-between align-items-center w-100">
                    <span>{section.name}
                      {isEditing && (
                      <button
                        className="btn btn-sm btn-outline-secondary ms-4"
                        onClick={() => handleAddRow(sectionIdx)}
                      >
                        +
                      </button>
                    )}

                    </span>


                  </div>
                </td>
              </tr>

                {section.items.map((item, itemIdx) => (
                  <tr key={itemIdx}>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'inline-block', position: 'relative' }}>
                          <input
                            type="text"
                            value={item.label}
                            onChange={e => handleLabelChange(sectionIdx, itemIdx, e.target.value)}
                            className="form-control form-control-sm"
                            style={{ width: 'auto', minWidth: '50px' }} // start small
                            onFocus={e => {
                              const span = document.createElement('span');
                              span.style.visibility = 'hidden';
                              span.style.whiteSpace = 'pre';
                              span.style.font = window.getComputedStyle(e.target).font;
                              span.innerText = e.target.value || ' '; 
                              document.body.appendChild(span);
                              e.target.style.width = `${span.offsetWidth + 30}px`; // add small padding
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
                            onBlur={e => e.target.style.width = '150px'} // optional: shrink back after editing
                          />
                        </div>
                      ) : 
                      <div className="ms-4" style={{ whiteSpace: 'pre-wrap' }}>
                        {item.label}
                      </div>
                      }
                    </td>

                      <td className="text-center px-1" style={{ width: '1%' }}>
                        {isEditing ? (
                          <select
                            value={item.kl}
                            onChange={e => handleKLChange(sectionIdx, itemIdx, e.target.value)}
                            className="form-select form-select-sm text-center"
                            style={{ minWidth: '60px' }} // ensures the text is visible
                          >
                            {['KL1', 'KL2', 'KL3', 'KL4', 'KL5'].map(kl => (
                              <option key={kl} value={kl}>{kl}</option>
                            ))}
                          </select>
                        ) : (
                          <span
                            style={{
                              fontWeight: 'bold',
                              color: getKLColor(item.kl),
                            }}
                          >
                            {item.kl}
                          </span>
                        )}
                      </td>

                      {item.values.map((val, yearIdx) => (
                        <td key={yearIdx} className="text-center px-1 px-sm-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={val}
                              onChange={e => handleValueChange(sectionIdx, itemIdx, yearIdx, e.target.value)}
                              className="form-control form-control-sm text-center"
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
                ))}
              </React.Fragment>
            ))}
          </tbody>

          <tfoot>
            <tr className="fw-bold">
              <td className="bg-success text-white text-start">YHTEENSÄ</td>
              <td className="bg-success text-white"></td>
              {yhteensa.map((sum, idx) => (
                <td key={idx} className="bg-success text-white text-end font-monospace px-2">{sum}</td>
              ))}
              {isEditing && <td className="bg-success text-white"></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
});


export default Tekniikkataulut;
