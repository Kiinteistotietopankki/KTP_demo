import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

export default function PiechartPTS({ tekniikkaYhteensa, lviYhteensa, sahkoYhteensa, tutkimusYhteensa }) {
  const [outerRadius, setOuterRadius] = useState(120);

  useEffect(() => {
    function handleResize() {
      setOuterRadius(window.innerWidth < 600 ? 80 : 120); // smaller radius for mobile
    }

    handleResize(); // set initial size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const data = [
    { name: 'Rakennetekniikka', value: tekniikkaYhteensa.reduce((a, b) => a + b, 0) },
    { name: 'LVI Järjestelmät', value: lviYhteensa.reduce((a, b) => a + b, 0) },
    { name: 'Sähköjärjestelmät', value: sahkoYhteensa.reduce((a, b) => a + b, 0) },
    { name: 'Lisätutkimukset', value: tutkimusYhteensa.reduce((a, b) => a + b, 0) }
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
        >
          <Cell fill="#7AA668" />
          <Cell fill="#A7BFA2" />
          <Cell fill="#C8D1BC" />
          <Cell fill="#2F5930" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
