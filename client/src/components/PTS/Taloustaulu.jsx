import { useEffect } from "react";

const Taloustaulu = ({ years, totalValuess=null, currentYear }) => {

    const huoneistoNeliot = 1200;

    const totalValues = [7, 45, 67, 30, 50, 5, 18, 160, 42, 2, 140];

    // Helper function to safely format numbers
    const formatVal2 = (val) => (val != null ? val.toFixed(2) : "-");
    const formatVal1 = (val) => (val != null ? val.toFixed(1) : "-");
    const formatVal0 = (val) => (val != null ? val.toFixed(0) : "-");

    // Calculate €/m² values as an array
    const perM2Values = totalValues.map(sum =>
        huoneistoNeliot > 0 ? ((sum * 1000) / huoneistoNeliot) : null
    );

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

    // Calculates the yearly multiplier for cumulative calculation
    const calculateYearlyMultiplier = (interestRate, loanYears) => {
        const monthlyRate = interestRate / 12;      // kuukausikorko
        const months = loanYears * 12;                    // maksujen määrä
        const factor = (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                    (Math.pow(1 + monthlyRate, months) - 1);
        return factor;  // kuukausittainen annuiteettikerroin
    };

    // Usage example:
    const yearlyMultiplier10 = calculateYearlyMultiplier(0.04, 10);  // ~0.01
    const yearlyMultiplier25 = calculateYearlyMultiplier(0.04, 25);  // ~0.0052

    console.log("10y yearly multiplier:", yearlyMultiplier10);
    console.log("25y yearly multiplier:", yearlyMultiplier25);

    const cumulative10 = calculateCumulative(perM2Values, yearlyMultiplier10);
    const cumulative25 = calculateCumulative(perM2Values, yearlyMultiplier25);

    useEffect(() => {
        console.log("Total values:", totalValues);
        console.log("Per m² values:", perM2Values);
    }, [totalValues]);

    return (
        <div className="my-4 ptstaulut">
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

                        {/* Total over 10 years */}
                        <tr>
                            <td className="text-start">Kustannukset yhteensä 10 vuoden jaksolla</td>
                            <td colSpan={years.length + 1} className="font-monospace px-2">
                                {(totalValues.reduce((acc, val) => acc + (val || 0), 0) * 1000).toLocaleString('fi-FI')} €
                            </td>
                        </tr>

                        <tr><td colSpan={years.length + 1}>&nbsp;</td></tr>

                        {/* Boss-style rows */}
                        <tr className="bg-success text-white">
                            <td className="text-start">Rahoitusvastike per huoneistoneliö 10v, 4% korko</td>
                            {cumulative10.map((val, idx) => (
                                <td key={idx} className="text-center font-monospace px-2">{formatVal2(val)}</td>
                            ))}
                        </tr>

                        <tr className="bg-success text-white">
                            <td className="text-start">Rahoitusvastike per huoneistoneliö 25v, 4% korko</td>
                            {cumulative25.map((val, idx) => (
                                <td key={idx} className="text-center font-monospace px-2">{formatVal2(val)}</td>
                            ))}
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
                                Teoreettinen rahoitusvastike 10v lainalla ja 4% korolla
                            </td>
                            <td colSpan={years.length + 1} className="bg-success text-white text-start ps-5">
                                {formatVal1(cumulative10[cumulative10.length - 1])} €/m²
                                {years[cumulative10.length - 1] ? ` Vuonna ${years[cumulative10.length - 1]}` : ""}
                            </td>
                        </tr>
                        <tr className="fw-bold">
                            <td className="bg-success text-white text-start p-1">
                                Teoreettinen rahoitusvastike 25v lainalla ja 4% korolla
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
