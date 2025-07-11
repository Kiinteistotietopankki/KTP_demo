import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TilastoTable = () => {
  const data = [
    { indicator: 2313, region: 273, year: 2019, gender: "total", value: 35000 },
    { indicator: 2313, region: 273, year: 2020, gender: "total", value: 35000 },
    { indicator: 2313, region: 273, year: 2021, gender: "total", value: 67000 },
    { indicator: 2313, region: 273, year: 2022, gender: "total", value: 63000 },
    { indicator: 2313, region: 273, year: 2023, gender: "total", value: 40775 },
    { indicator: 2313, region: 273, year: 2024, gender: "total", value: 83750 }
  ];

  // Sort descending by year (most recent first)
  const sortedData = [...data].sort((a, b) => b.year - a.year);

  return (
    <div className="container mt-4">
      <h3>Indicator Values by Year (Newest First)</h3>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Year</th>
            <th>Value</th>
            <th>Yearly Change %</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(({ year, value }, index) => {
            let yearlyChange = '-';
            if (index < sortedData.length - 1) {
              const nextValue = sortedData[index + 1].value;
              yearlyChange = (((value - nextValue) / nextValue) * 100).toFixed(2) + '%';
            }
            return (
              <tr key={year}>
                <td>{year}</td>
                <td>{value.toLocaleString()}</td>
                <td>{yearlyChange}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TilastoTable;
