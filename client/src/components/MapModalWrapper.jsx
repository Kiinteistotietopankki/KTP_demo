import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';  // assuming you're using react-bootstrap
import MapVisual from './MapVisual';

export default function MapModalWrapper({ coords }) {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <>
      <Button
        variant="outline-success"
        size="sm"
        className="rounded-pill fw-semibold shadow-sm mx-2 my-2 text-nowrap"
        onClick={() => setShowMapModal(true)}
      >
        <i className="bi bi-geo-alt-fill me-2"></i>
        Kartta
      </Button>

      <Modal
        show={showMapModal}
        onHide={() => setShowMapModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          {/* <Modal.Title>Karttanäkymä</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <MapVisual coords={coords} height="400px" />
        </Modal.Body>
      </Modal>
    </>
  );
}
