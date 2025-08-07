import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
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

const groupedMmlFetchOptions = [
  {
    title: "Perustiedot",
    options: [
      { label: "Perustiedot", fetcher: getPerustiedot, price: 0.30 },
      { label: "Rekisteriyksikkö", fetcher: getRekisteriyksikko, price: 0.30 },
      { label: "Määräala", fetcher: getMaaraAla, price: 0.30 },
      { label: "Laitos", fetcher: getLaitos, price: 0.30 },
      { label: "Yhteystieto", fetcher: getYhteystieto, price: 2.00 },
    ],
  },
  {
    title: "Lainhuutotiedot",
    options: [
      { label: "Lainhuutotiedot (ilman henkilötietoja)", fetcher: getLainhuutotiedotIlmanHenkilotietoja, price: 4.40 },
      { label: "Lainhuutotiedot (ilman henkilötunnuksia)", fetcher: getLainhuutotiedotIlmanHenkilotunnuksia, price: 4.40 },
      { label: "Lainhuutotiedot (henkilötunnuksilla)", fetcher: getLainhuutotiedotHenkilotunnuksilla, price: 4.40 },
    ],
  },
  {
    title: "Rasitustiedot",
    options: [
      { label: "Rasitustiedot (ilman henkilötietoja)", fetcher: getRasitustiedotIlmanHenkilotietoja, price: 4.40 },
      { label: "Rasitustiedot (ilman henkilötunnuksia)", fetcher: getRasitustiedotIlmanHenkilotunnuksia, price: 4.40 },
      { label: "Rasitustiedot (henkilötunnuksilla)", fetcher: getRasitustiedotHenkilotunnuksilla, price: 4.40 },
    ],
  },
  {
    title: "Vuokraoikeustiedot",
    options: [
      { label: "Vuokraoikeustiedot (ilman henkilötietoja)", fetcher: getVuokraoikeustiedotIlmanHenkilotietoja, price: 4.40 },
      { label: "Vuokraoikeustiedot (ilman henkilötunnuksia)", fetcher: getVuokraoikeustiedotIlmanHenkilotunnuksia, price: 4.40 },
      { label: "Vuokraoikeustiedot (henkilötunnuksilla)", fetcher: getVuokraoikeustiedotHenkilotunnuksilla, price: 4.40 },
    ],
  },
];

const renderData = (data) => {
  if (typeof data === "string" || typeof data === "number") return <span>{data}</span>;
  if (Array.isArray(data)) {
    return (
      <ul className="ml-4 list-disc">
        {data.map((item, index) => <li key={index}>{renderData(item)}</li>)}
      </ul>
    );
  }
  if (typeof data === "object" && data !== null) {
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
  const [selectedOptionToConfirm, setSelectedOptionToConfirm] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    if (!selectedOptionToConfirm) return;
    const option = selectedOptionToConfirm;

    setLoading(true);
    setError(null);
    setData(null);
    setSelected(option);

    try {
      const response = await option.fetcher(kohdetunnus);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(`Virhe haettaessa: ${option.label}`);
    } finally {
      setLoading(false);
      setSelectedOptionToConfirm(null);
    }
  };

  const handleCancel = () => {
    setSelectedOptionToConfirm(null);
    setError(null);
  };

  return (
    <div className="container my-4">
      <h5 className="text-center mb-4">
        <span className="fs-5 text-primary fw-semibold">{kohdetunnus}</span>
      </h5>

      {error && <Alert variant="danger">{error}</Alert>}

      {data && (
        <div className="mt-5 card border-primary">
          <div className="card-header bg-primary text-white fw-bold">
            {selected?.label}
          </div>
          <div className="card-body">
            {renderData(data)}
          </div>
        </div>
      )}

      {groupedMmlFetchOptions.map((group, gi) => (
        <div key={gi} className="mb-5">
          <h6 className="mb-3 border-bottom pb-1 fw-bold">{group.title}</h6>
          <div className="row g-3">
            {group.options.map((opt, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <button
                  onClick={() => setSelectedOptionToConfirm(opt)}
                  disabled={loading}
                  className="w-100 btn btn-outline-secondary text-start d-flex justify-content-between align-items-center p-3 shadow-sm border rounded transition"
                >
                  <div>
                    <div className="fw-semibold">{opt.label}</div>
                    <small className="text-muted">{opt.price.toFixed(2)} €</small>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {loading && (
        <div className="mt-4 text-muted">
          <Spinner animation="border" size="sm" className="me-2" />
            Ladataan...
        </div>
      )}



      {/* Confirmation Modal */}
      <Modal show={!!selectedOptionToConfirm} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vahvista haku</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Haluatko hakea tiedot: <strong>{selectedOptionToConfirm?.label}</strong>?
          </p>
          <p>
            Tämä maksaa <strong>{selectedOptionToConfirm?.price.toFixed(2)} €</strong>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Peruuta
          </Button>
          <Button variant="primary" onClick={handleFetch} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
            Hae tiedot
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MMLTabFetcher;
