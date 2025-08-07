// components/TulosteetTab.js
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
    <div className="p-3">
      <h5 className="text-center mb-4">
        <span className="fs-5 text-primary fw-semibold">{kiinteistotunnus}</span>
      </h5>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-grid gap-2">
        {tulosteetList.map((doc, index) => (
          <>
          <Button
            key={index}
            variant="outline-primary"
            className="text-center"
            onClick={() => setSelectedTuloste(doc)}
            disabled={loading}
          >
            {doc.label} — {doc.price.toFixed(2)} €
          </Button>
          <div className="border-top border-success my-1" style={{ height: '3px' }} />
          </>
        ))}
        
      </div>

      {/* Confirmation Modal */}
      <Modal show={!!selectedTuloste} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vahvista tulosteen haku</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Haluatko hakea tulosteen <strong>{selectedTuloste?.label}</strong>?<br />
          Tämä maksaa <strong>{selectedTuloste?.price.toFixed(2)} €</strong>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            Peruuta
          </Button>
          <Button variant="primary" onClick={handleConfirmDownload} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Vahvista ja lataa'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TulosteetTab;