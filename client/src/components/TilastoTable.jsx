import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getIndicatorValueByKuntaName } from '../api/api';
import { Form } from 'react-bootstrap';

//https://khr.maanmittauslaitos.fi/tilastopalvelu/rest/1.1/groups/23/indicators

// Linear regression calculation
const calculateTrendLine = (data) => {
  const n = data.length;
  const sumX = data.reduce((acc, d) => acc + d.year, 0);
  const sumY = data.reduce((acc, d) => acc + d.value, 0);
  const sumXY = data.reduce((acc, d) => acc + d.year * d.value, 0);
  const sumX2 = data.reduce((acc, d) => acc + d.year * d.year, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map(d => ({
    year: d.year,
    trend: intercept + slope * d.year
  }));
};

// Tooltip label formatter
const yearlyChangeLabel = (item) => {
  if (item.yearlyChange !== null && item.yearlyChange !== undefined) {
    return `Value (Change: ${item.yearlyChange}%)`;
  }
  return 'Value (Change: -)';
};

const TilastoTable = ({kunta, chartLabel}) => {
    const [data, setData] = useState([]);
    const kuntaName = kunta;

    const indicatorOptions = [
    { id: 2313, label: 'Asemakaava-alue' },
    { id: 2503, label: 'Haja-asutusalue' },
    ];

    const [selectedIndicator, setSelectedIndicator] = useState(indicatorOptions[0]);
    
    // Generate years from 2024 down to 1990
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let y = currentYear - 1; y >= 1990; y--) {
        years.push(y);
        }

    useEffect(() => {
      const yearsParam = years;

      getIndicatorValueByKuntaName(selectedIndicator.id, kuntaName, yearsParam)
        .then(response => {
          const jsonData = response.data;
          const sorted = jsonData.sort((a, b) => b.year - a.year);

          const withChange = sorted.map((item, index) => {
            if (index === sorted.length - 1) {
              return { ...item, yearlyChange: null };
            }
            const nextValue = sorted[index + 1].value;
            const change = ((item.value - nextValue) / nextValue) * 100;
            return { ...item, yearlyChange: change.toFixed(2) };
          });

          const trendData = calculateTrendLine(withChange);
          const merged = withChange.map((item, idx) => ({
            ...item,
            trend: trendData[idx].trend
          }));

          setData(merged);
        })
        .catch(err => {
          console.error('Fetch error:', err);
        });
    }, [selectedIndicator, kuntaName]); 

  return (
    <div style={{ width: '100%', maxWidth: '100vw'}}>
      <div className="text-center mb-2">
          <p className="fs-5 fw-light mb-1">
          {kunta} {chartLabel}
          </p>
          <Form.Select
            className="w-auto mx-auto"
            value={selectedIndicator.id}
            onChange={(e) => {
                const selected = indicatorOptions.find(opt => opt.id === parseInt(e.target.value));
                setSelectedIndicator(selected);
          }}
          >
          {indicatorOptions.map(opt => (
              <option key={opt.id} value={opt.id}>
              {opt.label}
              </option>
          ))}
          </Form.Select>
      </div>

      <ResponsiveContainer aspect={2} width="100%" height="100%">
        <LineChart
          data={[...data].reverse()} // chronological order
          margin={{ top: 1, right: 1, left: 1, bottom: 1 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis hide/>
          <Tooltip
            formatter={(value, name, props) => {
              const item = props.payload;
              return [
                value.toLocaleString(),
                name === 'Value' ? yearlyChangeLabel(item) : name
              ];
            }}
            labelFormatter={label => `Vuosi: ${label}`}
          />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#007bff" name="Arvo (€)" />
          <Line type="monotone" dataKey="trend" stroke="#ff7300" strokeDasharray="5 5" name="Trendi" />
        </LineChart>
      </ResponsiveContainer>  
    </div>
  );
};

export default TilastoTable;
