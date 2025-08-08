import { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion, Button, Card, Collapse, Modal } from 'react-bootstrap';
import exportToExcel from './Excelexport';
import exportToPdf from './Pdfexport';
import EditableReport from './ReportTemplate';
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

  // Track which rakennus card is open, store by kiinteistoIndex + rakennusIndex key
  const [openRakennusKey, setOpenRakennusKey] = useState(null);

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

  // Toggle collapse open/close for rakennus card
  const toggleRakennus = (key) => {
    setOpenRakennusKey(openRakennusKey === key ? null : key);
  };

  return (
    <div className="mt-4">
      <Modal show={showCreatedModal} onHide={() => setShowCreatedModal(false)} centered backdrop="static">
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
          <p className="mt-2 mb-0">Taloyhtiökortti luotu onnistuneesti!</p>
        </Modal.Body>
      </Modal>

      {kiinteistot.map((kiinteisto, kiinteistoIndex) => (
        <>
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

          <Card.Body className="bg-light-subtle">
            {kiinteisto.rakennukset?.length > 0 ? (
              kiinteisto.rakennukset.map((rakennus, rakennusIndex) => {
                const key = `${kiinteistoIndex}-${rakennusIndex}`;
                const isOpen = openRakennusKey === key;
                return (
                  <Card key={rakennusIndex} className="mb-3 border-0 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center bg-white p-2">
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => toggleRakennus(key)}
                          aria-expanded={isOpen}
                        >
                          <i className={`bi ${isOpen ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`}></i>
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

                    <Collapse in={isOpen}>
                      <Card.Body className="bg-white p-1">
                        <Tabletemplate properties={rakennus.properties.yleistiedot} />
                        <Tabletemplate properties={rakennus.properties.teknisettiedot} />
                        <Tabletemplate properties={rakennus.properties.rakennustiedot} />
                        <Tabletemplate properties={rakennus.properties.aluetiedot} />
                      </Card.Body>
                    </Collapse>
                  </Card>
                );
              })
            ) : (
              <div className="text-muted">Ei rakennuksia</div>
            )}
          </Card.Body>
        </Card>
        </>
      ))}
    </div>
  );
}

export default Resultdisplay;
