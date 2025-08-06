import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';  // assuming you're using react-bootstrap
import MapVisual from './MapVisual';

export default function MapModalWrapper({ coords }) {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <>
      <Button variant="success" onClick={() => setShowMapModal(true)}>
        Näytä kartalla
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
