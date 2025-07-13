import { useState } from "react";
import {
  getPerustiedot,
  getRekisteriyksikko,
  getMaaraAla,
  getLaitos,
  getYhteystieto,
  getLainhuutotiedotIlmanHenkilotietoja,
  getLainhuutotiedotIlmanHenkilotunnuksia,
  getLainhuutotiedotHenkilotunnuksilla,
  getRasitustiedotIlmanHenkilotietoja,
  getRasitustiedotIlmanHenkilotunnuksia,
  getRasitustiedotHenkilotunnuksilla,
  getVuokraoikeustiedotIlmanHenkilotietoja,
  getVuokraoikeustiedotIlmanHenkilotunnuksia,
  getVuokraoikeustiedotHenkilotunnuksilla,
} from "../api/mmlKiinteistot.js";

const mmlFetchOptions = [
  { label: "Perustiedot", fetcher: getPerustiedot, price: 0 },
  { label: "Rekisteriyksikkö", fetcher: getRekisteriyksikko, price: 0 },
  { label: "Määräala", fetcher: getMaaraAla, price: 0 },
  { label: "Laitos", fetcher: getLaitos, price: 0 },
  { label: "Yhteystieto", fetcher: getYhteystieto, price: 0 },

  { label: "Lainhuutotiedot (ilman henkilötietoja)", fetcher: getLainhuutotiedotIlmanHenkilotietoja, price: 5.60 },
  { label: "Lainhuutotiedot (ilman henkilötunnuksia)", fetcher: getLainhuutotiedotIlmanHenkilotunnuksia, price: 5.60 },
  { label: "Lainhuutotiedot (henkilötunnuksilla)", fetcher: getLainhuutotiedotHenkilotunnuksilla, price: 5.60 },

  { label: "Rasitustiedot (ilman henkilötietoja)", fetcher: getRasitustiedotIlmanHenkilotietoja, price: 5.60 },
  { label: "Rasitustiedot (ilman henkilötunnuksia)", fetcher: getRasitustiedotIlmanHenkilotunnuksia, price: 5.60 },
  { label: "Rasitustiedot (henkilötunnuksilla)", fetcher: getRasitustiedotHenkilotunnuksilla, price: 5.60 },

  { label: "Vuokraoikeustiedot (ilman henkilötietoja)", fetcher: getVuokraoikeustiedotIlmanHenkilotietoja, price: 5.60 },
  { label: "Vuokraoikeustiedot (ilman henkilötunnuksia)", fetcher: getVuokraoikeustiedotIlmanHenkilotunnuksia, price: 5.60 },
  { label: "Vuokraoikeustiedot (henkilötunnuksilla)", fetcher: getVuokraoikeustiedotHenkilotunnuksilla, price: 5.60 },
];

const renderData = (data) => {
  if (typeof data === 'string' || typeof data === 'number') return <span>{data}</span>;

  if (Array.isArray(data)) {
    return (
      <ul className="ml-4 list-disc">
        {data.map((item, index) => <li key={index}>{renderData(item)}</li>)}
      </ul>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <ul className="ml-4">
        {Object.entries(data).map(([key, value]) => (
          <li key={key}><strong>{key}</strong>: {renderData(value)}</li>
        ))}
      </ul>
    );
  }

  return null;
};

const MMLTabFetcher = ({ kohdetunnus }) => {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async (option) => {
    const confirmed = window.confirm(`Tämä maksaa ${option.price.toFixed(2)} €. Jatketaanko?`);
    if (!confirmed) return;

    setLoading(true);
    setSelected(option);
    setData(null);

    try {
      const response = await option.fetcher(kohdetunnus);
      setData(response.data);
    } catch (err) {
      console.error(err);
      alert(`Virhe haettaessa: ${option.label}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h5 className="mb-3">Tietojen haku kohteelle: <strong>{kohdetunnus}</strong></h5>

      <div className="grid gap-2 sm:grid-cols-2">
        {mmlFetchOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleFetch(opt)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-900 text-left px-4 py-2 rounded border"
            disabled={loading}
          >
            {opt.label} — {opt.price.toFixed(2)} €
          </button>
        ))}
      </div>

      {loading && <p className="mt-4 text-gray-600">Ladataan...</p>}

      {data && (
        <div className="mt-4 bg-gray-50 border p-4 rounded">
          <h6 className="mb-2 font-semibold">{selected?.label}</h6>
          {renderData(data)}
        </div>
      )}
    </div>
  );
};

export default MMLTabFetcher;
