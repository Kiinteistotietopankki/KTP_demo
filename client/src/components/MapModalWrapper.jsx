import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';  // assuming you're using react-bootstrap
import MapVisual from './MapVisual';

export default function MapModalWrapper({ coords }) {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <>
      <Button
        variant="success"
        className="btn-thin mx-2 my-2"
        onClick={() => setShowMapModal(true)}
        style={{
          'padding': '3px 3px',
          'font-size': '1rem',
          'line-height': '1.25',
        }}
      >
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
