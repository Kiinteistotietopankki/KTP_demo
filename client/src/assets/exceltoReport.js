import React, { useState, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { Chart } from 'chart.js/auto';
import 'handsontable/dist/handsontable.full.min.css';


registerAllModules();

const ExcelTabs = () => {
  const [sheets, setSheets] = useState({
    PTS: [
      ['', ''," ", ""],
      ['', , ,],
      ['', , ,],
      ['', ,] ,,
    ],
  });
  const [activeTab, setActiveTab] = useState('PTS');
  const [xCol, setXCol] = useState(0);
  const [yCol, setYCol] = useState(1);
  const [chartType, setChartType] = useState('line');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const handleTabClick = (sheetName) => setActiveTab(sheetName);

  const handleAddTab = () => {
    let name = prompt('Anna uuden tabin nimi:');
    if (!name) return;
    name = name.trim();
    if (name === '') return;

    let newName = name;
    let index = 1;
    while (sheets[newName]) {
      newName = `${name} (${index++})`;
    }

    setSheets({
      ...sheets,
      [newName]: [['', '', '', '', '', '', '', '']],
    });
    setActiveTab(newName);
  };

  const handleRemoveTab = () => {
    if (Object.keys(sheets).length <= 1) return;
    const newSheets = { ...sheets };
    delete newSheets[activeTab];
    const remainingTabs = Object.keys(newSheets);
    setActiveTab(remainingTabs[0]);
    setSheets(newSheets);
  };

  const handleShowChart = () => {
    const data = sheets[activeTab];
    if (!data || data.length < 2) return alert('Ei tarpeeksi dataa');

    const labels = data.slice(1).map(row => row[xCol]);
    const values = data.slice(1).map(row => Number(row[yCol]));

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            label: `Sarake ${yCol + 1}`,
            data: values,
            backgroundColor: [
              'rgba(41, 209, 41, 0.5)',
              'rgba(56, 15, 204, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(153, 102, 255, 0.5)',
            ],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: chartType === 'line',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: chartType !== 'pie',
          },
        },
        scales: chartType === 'pie' ? {} : {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-3">
        {Object.keys(sheets).map((sheet) => (
          <button
            key={sheet}
            className={`btn btn-sm ${activeTab === sheet ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleTabClick(sheet)}
          >
            {sheet}
          </button>
        ))}
        <button className="btn btn-sm btn-success" onClick={handleAddTab}>➕</button>
        {Object.keys(sheets).length > 1 && (
          <button className="btn btn-sm btn-danger" onClick={handleRemoveTab}>❌</button>
        )}
      </div>

      {/* HotTable */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <HotTable
          data={sheets[activeTab]}
          colHeaders={true}
          rowHeaders={true}
          stretchH="all"
          height={500}
          width="100%"
          minRows={20}
          minCols={8}
          allowInsertColumn={true}
          allowInsertRow={true}
          manualColumnResize={true}
          manualRowResize={true}
          contextMenu={true}
          dropdownMenu={true}
          licenseKey="non-commercial-and-evaluation"
          afterChange={(changes, source) => {
            if (source !== 'loadData' && changes) {
              setSheets((prev) => {
                const updated = [...prev[activeTab]];
                changes.forEach(([row, col, , newVal]) => {
                  if (!updated[row]) updated[row] = [];
                  updated[row][col] = newVal;
                });
                return { ...prev, [activeTab]: updated };
              });
            }
          }}
        />
      </div>

      {/* Chart Options */}
      <div className="flex flex-wrap gap-3 items-center my-4">
        <div>
          <label>Kaavion tyyppi: </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="form-select form-select-sm"
            style={{ width: '140px', display: 'inline-block' }}
          >
            <option value="line">Viivakaavio (Line)</option>
            <option value="bar">Pylväskaavio (Bar)</option>
            <option value="pie">Ympyräkaavio (Pie)</option>
          </select>
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleShowChart}>
          📈 Näytä kaavio
        </button>
      </div>

      {/* Chart */}
      <div>
        <canvas ref={chartRef} style={{ width: '100%', height: '400px' }} />
      </div>
    </div>
  );
};

export default ExcelTabs;
