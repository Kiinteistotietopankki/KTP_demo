import { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Button, Card, Modal } from 'react-bootstrap';
import exportToExcel from './Excelexport';
import exportToPdf from './Pdfexport';
import PropertyDetailsForm from './report/ReportTemplate.js'
import '../App.css';
import { jsonToModelFormat } from '../assets/jsonToDBmodel';
import { prettifyJson } from '../assets/prettifyJson';
import { createKiinteisto } from '../api/api';
import MapModalWrapper from './MapModalWrapper';

function Resultdisplay({ data, setMapCoords }) {
  const [kiinteistot, setKiinteistot] = useState([]);
  const [selectedRakennukset, setSelectedRakennukset] = useState({});
  const [response, setResponse] = useState({});
  const [showCreatedModal, setShowCreatedModal] = useState(false);

  // Store currently selected rakennus for modal
  const [selectedRakennus, setSelectedRakennus] = useState(null);

  useEffect(() => {
    if (data[0]?.rakennukset.length) {
      setKiinteistot(data);
    }
  }, [data]);

  useEffect(() => {
    if (
      Array.isArray(kiinteistot) &&
      kiinteistot[0]?.rakennukset?.[0]?.geometry?.coordinates
    ) {
      setMapCoords(kiinteistot[0].rakennukset[0].geometry.coordinates);
    }
  }, [kiinteistot]);

  const copyText = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const handleCheckboxChange = (rakennusTunnusValue) => {
    setSelectedRakennukset((prev) => {
      const updated = { ...prev };
      if (updated[rakennusTunnusValue]) {
        delete updated[rakennusTunnusValue];
      } else {
        updated[rakennusTunnusValue] = true;
      }
      return updated;
    });
  };

  const handleSelectAll = () => {
    const allSelected = {};
    kiinteistot.forEach((kiinteisto) => {
      kiinteisto.rakennukset?.forEach((rakennus) => {
        allSelected[rakennus.properties.yleistiedot.Rakennustunnus?.value] = true;
      });
    });
    if (Object.keys(selectedRakennukset).length === Object.keys(allSelected).length) {
      setSelectedRakennukset({});
    } else {
      setSelectedRakennukset(allSelected);
    }
  };

  const luoKortti = (kiinteisto) => {
    const modelFormatKiinteisto = jsonToModelFormat(kiinteisto);
    createKiinteisto(modelFormatKiinteisto)
      .then((res) => {
        setResponse(res.data);
        setShowCreatedModal(true);
        setTimeout(() => setShowCreatedModal(false), 2500);
      })
      .catch((err) => console.error('Api error', err));
  };

  // Open rakennus detail modal
  const openRakennusModal = (rakennus) => {
    setSelectedRakennus(rakennus);
  };

  // Close rakennus detail modal
  const closeRakennusModal = () => {
    setSelectedRakennus(null);
  };

  return (
    <div className="mt-4">
      {/* Success modal for Taloyhtiökortti creation */}
      <Modal show={showCreatedModal} onHide={() => setShowCreatedModal(false)} centered backdrop="static">
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
          <p className="mt-2 mb-0">Taloyhtiökortti luotu onnistuneesti!</p>
        </Modal.Body>
      </Modal>

      {kiinteistot.map((kiinteisto, kiinteistoIndex) => (
        <Card key={kiinteistoIndex} className="mb-4 border result-card">
          <Card.Header
            className="bg-primary text-white d-flex justify-content-center align-items-center flex-wrap"
            style={{ flexDirection: 'column' }}
          >
            <div
              className="d-flex align-items-center flex-wrap gap-2 justify-content-center"
              style={{ minWidth: 0, margin: '0 auto', maxWidth: '100%' }}
            >
              <small
                className="text-white-50"
                style={{ fontSize: '1rem', fontWeight: '400' }}
                title="Toimipaikka"
              >
                KIINTEISTÖ
              </small>

              <span
                className="fw-bold text-truncate"
                style={{ fontSize: '1.1rem', color: 'white', letterSpacing: '0.02em', maxWidth: '150px' }}
                title={kiinteisto?.id_esitysmuoto_kiinteistotunnus || 'N/A'}
              >
                {kiinteisto?.id_esitysmuoto_kiinteistotunnus || 'N/A'}
              </span>

              <Button
                variant="outline-light"
                size="sm"
                className="p-1 flex-shrink-0"
                onClick={() => copyText(kiinteisto?.id_esitysmuoto_kiinteistotunnus)}
                aria-label="Kopioi kiinteistötunnus"
                title="Kopioi kiinteistötunnus"
                style={{
                  padding: '0.15rem 0.25rem',
                  minWidth: 'auto',
                  fontSize: '0.8rem',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                <i className="bi bi-clipboard" style={{ fontSize: '0.9rem' }}></i> Kopioi
              </Button>

              <Button
                variant="outline-light"
                size="sm"
                className="rounded-pill fw-semibold"
                onClick={() => luoKortti(kiinteisto)}
                style={{ whiteSpace: 'nowrap', padding: '0.25rem 0.75rem' }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Luo kortti
              </Button>
            </div>
          </Card.Header>

          <Card.Body className="bg-light-subtle" style={{ border: '1px solid #04aa00', borderRadius: '0.2rem' }}>
            {kiinteisto.rakennukset?.length > 0 ? (
              kiinteisto.rakennukset.map((rakennus, rakennusIndex) => {
                return (
                  <Card key={rakennusIndex} className="mb-3 border-0 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => openRakennusModal(rakennus)}
                          aria-label="Näytä rakennuksen tiedot"
                        >
                          <i className="bi bi-info-circle"></i>
                        </Button>

                        <label className="form-check-label fw-semibold text-secondary m-0">
                          {rakennus.properties.yleistiedot.Rakennustunnus?.value} -{' '}
                          {Array.isArray(rakennus.properties.yleistiedot['Kohteen osoitteet']?.value)
                            ? rakennus.properties.yleistiedot['Kohteen osoitteet'].value.join(', ')
                            : rakennus.properties.yleistiedot['Kohteen osoitteet']?.value || ''}{' '}
                          ({rakennus.properties.yleistiedot.Toimipaikka.value})
                        </label>

                        <MapModalWrapper coords={[rakennus.geometry.coordinates[1], rakennus.geometry.coordinates[0]]} />
                      </div>
                    </Card.Header>
                  </Card>
                );
              })
            ) : (
              <div className="text-muted">Ei rakennuksia</div>
            )}
          </Card.Body>
        </Card>
      ))}

      {/* Modal for showing rakennus details */}
      <Modal
        show={!!selectedRakennus}
        onHide={closeRakennusModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Rakennus: {selectedRakennus?.properties.yleistiedot.Rakennustunnus?.value || ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRakennus && (
            <>
            <h6 className="text-success fw-light mb-2">Yleistiedot</h6>
            <div className="border-top border-success my-1" style={{ height: '3px' }} />
            <Tabletemplate properties={selectedRakennus.properties.yleistiedot} />

            <h6 className="text-success fw-light mb-2">Tekniset tiedot</h6>
            <div className="border-top border-success my-1" style={{ height: '3px' }} />
            <Tabletemplate properties={selectedRakennus.properties.teknisettiedot} />

          
            <h6 className="text-success fw-light mb-2">Rakennustiedot</h6>
            <div className="border-top border-success my-1" style={{ height: '3px' }} />
            <Tabletemplate properties={selectedRakennus.properties.rakennustiedot} />

            <h6 className="text-success fw-light mb-2">Aluetiedot</h6>
            <div className="border-top border-success my-1" style={{ height: '3px' }} />
            <Tabletemplate properties={selectedRakennus.properties.aluetiedot} />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeRakennusModal}>
            Sulje
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Resultdisplay;
