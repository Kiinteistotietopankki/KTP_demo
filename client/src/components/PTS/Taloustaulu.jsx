import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const Taloustaulu = ({ years, totalValues, currentYear }) => {
    const huoneistoNeliot = 1200;
    // const totalValues = [7, 45, 67, 30, 50, 5, 18, 160, 42, 2, 140];

    // New state for UI
    const [interestRate, setInterestRate] = useState(0.04);  // default 4 %
    const [paymentsPerYear, setPaymentsPerYear] = useState(12); // default monthly
    const [intervalText, setIntervalText] = useState("");

    useEffect(() => {
        let text;
            switch (paymentsPerYear) {
                case 12:
                text = "kuukausittain";
                break;
                case 4:
                text = "neljännesvuosittain";
                break;
                case 2:
                text = "puolivuosittain";
                break;
                case 1:
                text = "vuosittain";
                break;
                default:
                text = `${paymentsPerYear} kertaa vuodessa`;
            }
        setIntervalText(text);
    }, [paymentsPerYear]);
    

    // Helpers
    const formatVal2 = (val) => (val != null ? val.toFixed(2) : "-");
    const formatVal1 = (val) => (val != null ? val.toFixed(1) : "-");
    const formatVal0 = (val) => (val != null ? val.toFixed(0) : "-");

    const [perM2Values, setPerM2Values] = useState([]);

    useEffect(() => {
        if (huoneistoNeliot > 0 && totalValues?.length) {
            const values = totalValues.map(sum => (sum * 1000) / huoneistoNeliot);
            setPerM2Values(values);
        }
    }, [totalValues, huoneistoNeliot]);

    const calculateCumulative = (perM2Values, yearlyMultiplier) => {
        const cumulative = [];
        let runningSum = 0;
        perM2Values.forEach(cost => {
            if (cost != null) {
                runningSum += cost * yearlyMultiplier;
                cumulative.push(runningSum);
            } else {
                cumulative.push(null);
            }
        });
        return cumulative;
    };

    const calculateAnnuityFactor = (interestRate, loanYears, paymentsPerYear = 12) => {
        const periodRate = interestRate / paymentsPerYear;
        const periods = loanYears * paymentsPerYear;
        const factor = (periodRate * Math.pow(1 + periodRate, periods)) /
                     (Math.pow(1 + periodRate, periods) - 1);
        return factor;
    };


    // Factors based on user selection
    const factor10 = calculateAnnuityFactor(interestRate, 10, paymentsPerYear);
    const factor25 = calculateAnnuityFactor(interestRate, 25, paymentsPerYear);

    const cumulative10 = calculateCumulative(perM2Values, factor10);
    const cumulative25 = calculateCumulative(perM2Values, factor25);

    const chartData = years.map((year, idx) => ({
        year,
        "10v laina": cumulative10[idx] || 0,
        "25v laina": cumulative25[idx] || 0,
    }));

    useEffect(() => {
        console.log("Total values:", totalValues);
        console.log("Per m² values:", perM2Values);
    }, [totalValues]);

    return (
        <div className="my-5 ptstaulut">
            <div className="mb-4" style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                    formatter={(value, name) => [`${value.toFixed(2)} €/m²`, name]} 
                    />
                    <Legend 
                    layout="vertical"       // stack items vertically
                    verticalAlign="bottom"  // position legend below the chart
                    align="center"          // center horizontally
                    />
                    <Line 
                    type="monotone" 
                    dataKey="10v laina" 
                    stroke="#2F5930" 
                    strokeWidth={2} 
                    name={`Rahoitusvastike / huoneistoneliö 10v lainalla ja ${(interestRate*100).toFixed(2)}% korolla`} 
                    />
                    <Line 
                    type="monotone" 
                    dataKey="25v laina" 
                    stroke="#82ca9d" 
                    strokeWidth={2} 
                    name={`Rahoitusvastike / huoneistoneliö 25v lainalla ja ${(interestRate*100).toFixed(2)}% korolla`} 
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 🔹 Controls for user */}
           <div className="mb-3 d-flex flex-column flex-sm-row justify-content-center gap-3 align-items-center">
                <div className="text-center text-sm-start">
                    <label className="fw-bold">Korko (%):</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={(interestRate * 100).toFixed(2)}
                        onChange={e => setInterestRate(parseFloat(e.target.value) / 100)}
                        className="form-control w-auto mx-auto"
                    />
                </div>
                <div className="text-center text-sm-start">
                    <label className="fw-bold">Maksutiheys:</label>
                    <select
                        value={paymentsPerYear}
                        onChange={e => setPaymentsPerYear(parseInt(e.target.value))}
                        className="form-select w-auto mx-auto"
                    >
                        <option value={12}>Kuukausittain</option>
                        <option value={4}>Neljännesvuosittain</option>
                        <option value={2}>Puolivuosittain</option>
                        <option value={1}>Vuosittain</option>
                    </select>
                </div>
            </div>

            {/* 🔹 Your original table, untouched */}
            <div className="table-responsive">
                <table className="table table-sm table-borderless table-striped mb-0">
                    {/* Header */}
                    <thead>
                        <tr>
                            <th colSpan={years.length + 2} className="bg-success text-white p-2">
                                <div className="d-flex justify-content-between">
                                    <div className="fw-bold">Kustannusten jakautuminen</div>
                                    <div className="small text-end">Kustannustaso {currentYear} sis. Alv 25,5%</div>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {/* Column headers */}
                    <thead>
                        <tr>
                            <th className="bg-success text-white text-start"></th>
                            {years.map(year => (
                                <th key={year} className="bg-success text-white text-center px-2 fw-normal">
                                    {year}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Total costs */}
                        <tr className="bg-success text-white">
                            <td className="text-start">
                                Kustannukset taloyhtiölle yhteensä vuosittain <br /> 
                                <div className="text-center">(x 1000€)</div>
                            </td>
                            {totalValues.map((sum, idx) => (
                                <td key={idx} className="text-center font-monospace align-middle">{sum != null ? sum : "-"}</td>
                            ))}
                        </tr>

                        <tr><td colSpan={years.length + 1}>&nbsp;</td></tr>

                        {/* €/m² row */}
                        <tr className="bg-success text-white">
                            <td className="text-start">Kustannukset vuosittain € / huoneistoneliö</td>
                            {perM2Values.map((val, idx) => (
                                <td key={idx} className="text-center font-monospace px-2">{formatVal2(val)}</td>
                            ))}
                        </tr>

                        <tr><td colSpan={years.length + 1}>&nbsp;</td></tr>

                        {/* Boss-style rows */}
                        <tr className="bg-success text-white">
                            <td className="text-start">
                                Rahoitusvastike per huoneistoneliö 10v, {(interestRate*100).toFixed(2)}% korko
                            </td>
                            {cumulative10.map((val, idx) => (
                                <td key={idx} className="text-center font-monospace px-2">{formatVal2(val)}</td>
                            ))}
                        </tr>

                        <tr className="bg-success text-white">
                            <td className="text-start">
                                Rahoitusvastike per huoneistoneliö 25v, {(interestRate*100).toFixed(2)}% korko
                            </td>
                            {cumulative25.map((val, idx) => (
                                <td key={idx} className="text-center font-monospace px-2">{formatVal2(val)}</td>
                            ))}
                        </tr>

                        <tr><td colSpan={years.length + 1}>&nbsp;</td></tr>

                        {/* Total over 10 years */}
                        <tr>
                            <td className="text-start">Kustannukset yhteensä 10 vuoden jaksolla</td>
                            <td colSpan={years.length + 1} className="font-monospace px-2">
                                {(totalValues.reduce((acc, val) => acc + (val || 0), 0) * 1000).toLocaleString('fi-FI')} €
                            </td>
                        </tr>

                        <tr><td colSpan={years.length + 1}>&nbsp;</td></tr>

                        {/* Huoneistoala */}
                        <tr>
                            <td className="text-start">Kohteen huoneistoala</td>
                            <td className="ps-5" colSpan={years.length + 1}>{huoneistoNeliot} m²</td>
                        </tr>

                        <tr>
                            <td className="text-start">Kertakustannus per huoneistoneliö 10v ajanjaksolla</td>
                            <td className="ps-5" colSpan={years.length + 1}>
                                {formatVal0((totalValues.reduce((acc, val) => acc + (val || 0), 0) * 1000) / huoneistoNeliot).toLocaleString('fi-FI')} € /m²
                            </td>
                        </tr>
                    </tbody>

                    {/* Footer */}
                    <tfoot>
                        <tr className="fw-bold">
                            <td className="bg-success text-white text-start p-1">
                                Teoreettinen rahoitusvastike 10v lainalla ja {(interestRate*100).toFixed(2)}% korolla {intervalText}
                            </td>
                            <td colSpan={years.length + 1} className="bg-success text-white text-start ps-5">
                                {formatVal1(cumulative10[cumulative10.length - 1])} €/m²
                                {years[cumulative10.length - 1] ? ` Vuonna ${years[cumulative10.length - 1]}` : ""}
                            </td>
                        </tr>
                        <tr className="fw-bold">
                            <td className="bg-success text-white text-start p-1">
                                Teoreettinen rahoitusvastike 25v lainalla ja {(interestRate*100).toFixed(2)}% korolla {intervalText}
                            </td>
                            <td colSpan={years.length + 1} className="bg-success text-white text-start ps-5">
                                {formatVal1(cumulative25[cumulative25.length - 1])} €/m²
                                {years[cumulative25.length - 1] ? ` Vuonna ${years[cumulative25.length - 1]}` : ""}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default Taloustaulu;
