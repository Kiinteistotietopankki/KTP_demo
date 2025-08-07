import { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion, Button, Card, Col, Container, ListGroup, Row, Tab, Tabs } from 'react-bootstrap';
import exportToExcel from './Excelexport';
import exportToPdf from './Pdfexport';
import EditableReport from './ReportTemplate';
import Modal from 'react-bootstrap/Modal';
import '../App.css';
import { jsonToModelFormat } from '../assets/jsonToDBmodel';
import { prettifyJson } from '../assets/prettifyJson';
import { createKiinteisto } from '../api/api';
import MapModalWrapper from './MapModalWrapper';

function Resultdisplay({ data, setMapCoords }) {
  const [kiinteistot, setKiinteistot] = useState([]);
  const [selectedRakennukset, setSelectedRakennukset] = useState({});


  //For alt ui 
  const [selectedRakennus, setSelectedRakennus] = useState([]);
  const [selectedRakennusPerKiinteisto, setSelectedRakennusPerKiinteisto] = useState({});


  const [response, setResponse] = useState({})


  useEffect(() => {
        if (data[0]?.rakennukset.length){
            // console.log(data)
            setKiinteistot(data);
        }
    }, [data]);

    // Initial map view
    useEffect(() => {
        if (Array.isArray(kiinteistot) && kiinteistot[0]?.rakennukset?.[0]?.geometry?.coordinates){
            setMapCoords(kiinteistot[0]?.rakennukset[0]?.geometry?.coordinates)
        }
    }, [kiinteistot]);

    const copyText = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy)
      };

      const handleCheckboxChange = (rakennusTunnusValue) => {
        setSelectedRakennukset(prev => {
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
    kiinteistot.forEach(kiinteisto => {
      kiinteisto.rakennukset?.forEach(rakennus => {
        allSelected[rakennus.properties.yleistiedot.Rakennustunnus?.value] = true;
      });
    });
    if (Object.keys(selectedRakennukset).length === Object.keys(allSelected).length) {
      setSelectedRakennukset({});
    } else {
      setSelectedRakennukset(allSelected);
    }
  };

  const [showCreatedModal, setShowCreatedModal] = useState(false);

  const luoKortti = (kiinteisto) => {
    const modelFormatKiinteisto = jsonToModelFormat(kiinteisto);
    console.log('DB FORMAT:', modelFormatKiinteisto)

    createKiinteisto(modelFormatKiinteisto)
      .then(res => {
        setResponse(res.data);
        setShowCreatedModal(true); // Show the modal
        setTimeout(() => setShowCreatedModal(false), 2500); // Hide after 2.5s
      })
      .catch(err => console.error('Api error', err));
  };


  return (
  <div className="mt-4">

    <Modal show={showCreatedModal} onHide={() => setShowCreatedModal(false)} centered backdrop="static">
      <Modal.Body className="text-center">
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
      <p className="mt-2 mb-0">Taloyhtiökortti luotu onnistuneesti!</p>
      </Modal.Body>
    </Modal>
    <div className="d-flex justify-content-between align-items-center mb-3">

    </div>

    {kiinteistot.map((kiinteisto, kiinteistoIndex) => (
      <Card key={kiinteistoIndex} className="mb-4 shadow border-primary">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Kiinteistö: <span className="fw-bold">{kiinteisto?.id_esitysmuoto_kiinteistotunnus || "N/A"}, {kiinteisto?.rakennukset[0].properties.yleistiedot.Toimipaikka.value}</span>
          </h5>
          <div>
            <Button variant="outline-light" size="sm" className="me-2" onClick={() => copyText(kiinteisto?.id_esitysmuoto_kiinteistotunnus)}>
              <i className="bi bi-clipboard"></i> Kopioi tunnus
            </Button>
            <Button variant="light" size="sm" onClick={() => luoKortti(kiinteisto)}>
              <i className="bi bi-plus-circle me-1"></i> Luo taloyhtiökortti
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="bg-light">
          {kiinteisto.rakennukset?.length > 0 ? (
            kiinteisto.rakennukset.map((rakennus, rakennusIndex) => (
              <Card key={rakennusIndex} className="mb-3 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                  <label className="form-check-label fw-medium">
                  
                    {rakennus.properties.yleistiedot.Rakennustunnus?.value} -{" "}
                    {Array.isArray(rakennus.properties.yleistiedot["Kohteen osoitteet"]?.value)
                      ? rakennus.properties.yleistiedot["Kohteen osoitteet"].value.join(", ")
                      : rakennus.properties.yleistiedot["Kohteen osoitteet"]?.value || ""}
                    {" "} ({rakennus.properties.rakennustiedot["Rakennusluokitus"].value})
                  </label>

                  <MapModalWrapper coords={[rakennus.geometry.coordinates[1],rakennus.geometry.coordinates[0]]} />
                </Card.Header>

                <Card.Body className="bg-light-subtle">
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Yleistiedot</Accordion.Header>
                      <Accordion.Body>
                        <Tabletemplate properties={rakennus.properties.yleistiedot} />
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Tekniset tiedot</Accordion.Header>
                      <Accordion.Body>
                        <Tabletemplate properties={rakennus.properties.teknisettiedot} />
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>Rakennustiedot</Accordion.Header>
                      <Accordion.Body>
                        <Tabletemplate properties={rakennus.properties.rakennustiedot} />
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>Aluetiedot</Accordion.Header>
                      <Accordion.Body>
                        <Tabletemplate properties={rakennus.properties.aluetiedot} />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-muted">Ei rakennuksia</div>
          )}
        </Card.Body>
      </Card>
    ))}
    
    {/* {selectedRakennus && (
      <MapModalWrapper coords={selectedRakennus} />
    )} */}

  </div>
  );
}

export default Resultdisplay;