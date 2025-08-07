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
        <Card key={kiinteistoIndex} className="mb-4 border rounded-3">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3 rounded-top-4">
            <h5 className="mb-0">
              Kiinteistö:{' '}
              <span className="fw-bold">
                {kiinteisto?.id_esitysmuoto_kiinteistotunnus  || 'N/A'},{' '}
                {kiinteisto?.rakennukset[0].properties.yleistiedot.Toimipaikka.value}
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="ms-2"
                    onClick={() => copyText(kiinteisto?.id_esitysmuoto_kiinteistotunnus)}
                  >
                    <i className="bi bi-clipboard"></i>
                  </Button>
              </span>
            </h5>
            <div>

              <Button variant="light" size="sm" onClick={() => luoKortti(kiinteisto)}>
                <i className="bi bi-plus-circle me-1"></i> Luo taloyhtiökortti
              </Button>
            </div>
          </Card.Header>

          <Card.Body className="bg-light-subtle p-3">
            {kiinteisto.rakennukset?.length > 0 ? (
              kiinteisto.rakennukset.map((rakennus, rakennusIndex) => {
                const key = `${kiinteistoIndex}-${rakennusIndex}`;
                const isOpen = openRakennusKey === key;
                return (
                  <Card key={rakennusIndex} className="mb-3 border-0 shadow-sm rounded-3">
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
                          ({rakennus.properties.rakennustiedot['Rakennusluokitus'].value})
                        </label>
                      </div>

                      <MapModalWrapper coords={[rakennus.geometry.coordinates[1], rakennus.geometry.coordinates[0]]} />
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
      ))}
    </div>
  );
}

export default Resultdisplay;
