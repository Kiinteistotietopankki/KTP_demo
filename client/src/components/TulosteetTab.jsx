import { useState } from 'react';
import { Button, Spinner, Modal, Alert } from 'react-bootstrap';
import { saveAs } from 'file-saver';

import {
  getRasitustodistus,
  getLainhuutotodistus,
  getVuokraoikeustodistus,
} from '../api/mmlTulosteet.js';

const tulosteetList = [
  {
    label: 'Rasitustodistus (henkilötiedoilla)',
    fetcher: (kt) => getRasitustodistus(kt, true),
    price: 5.60,
  },
  {
    label: 'Rasitustodistus (ilman henkilötietoja)',
    fetcher: (kt) => getRasitustodistus(kt, false),
    price: 5.60,
  },
  {
    label: 'Lainhuutotodistus (henkilötiedoilla)',
    fetcher: (kt) => getLainhuutotodistus(kt, true),
    price: 5.60,
  },
  {
    label: 'Lainhuutotodistus (ilman henkilötietoja)',
    fetcher: (kt) => getLainhuutotodistus(kt, false),
    price: 5.60,
  },
  {
    label: 'Vuokraoikeustodistus (henkilötiedoilla)',
    fetcher: (kt) => getVuokraoikeustodistus(kt, true),
    price: 5.60,
  },
  {
    label: 'Vuokraoikeustodistus (ilman henkilötietoja)',
    fetcher: (kt) => getVuokraoikeustodistus(kt, false),
    price: 5.60,
  },
];

const TulosteetTab = ({ kiinteistotunnus }) => {
  const [selectedTuloste, setSelectedTuloste] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmDownload = async () => {
    if (!selectedTuloste) return;
    setLoading(true);
    setError(null);

    try {
      const response = await selectedTuloste.fetcher(kiinteistotunnus);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `${selectedTuloste.label}.pdf`);
    } catch (err) {
      console.error(err);
      setError(`Virhe ladattaessa: ${selectedTuloste.label}`);
    } finally {
      setLoading(false);
      setSelectedTuloste(null);
    }
  };

  const handleCancel = () => {
    setSelectedTuloste(null);
    setError(null);
  };

  return (
    <div className="container my-4">
      <h5 className="text-center mb-4">
        <span className="fs-5 text-primary fw-semibold">{kiinteistotunnus}</span>
      </h5>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="row g-3">
        {tulosteetList.map((doc, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <button
              onClick={() => setSelectedTuloste(doc)}
              disabled={loading}
              className="w-100 btn btn-outline-secondary text-start d-flex justify-content-between align-items-center p-3 shadow-sm border rounded transition"
            >
              <div>
                <div className="fw-semibold">{doc.label}</div>
                <small className="text-muted">{doc.price.toFixed(2)} €</small>
              </div>
              <i className="bi bi-chevron-right text-muted"></i>
            </button>
          </div>
        ))}
      </div>

      {loading && (
        <div className="mt-4 text-muted">
          <Spinner animation="border" size="sm" className="me-2" />
          Ladataan...
        </div>
      )}

      <Modal show={!!selectedTuloste} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vahvista tulosteen haku</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Haluatko hakea tulosteen <strong>{selectedTuloste?.label}</strong>?
          </p>
          <p>
            Tämä maksaa <strong>{selectedTuloste?.price.toFixed(2)} €</strong>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            Peruuta
          </Button>
          <Button variant="primary" onClick={handleConfirmDownload} disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : null}
            Vahvista ja lataa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TulosteetTab;
