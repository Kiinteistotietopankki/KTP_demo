import React, { useEffect, useState } from 'react';
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

function Resultdisplay({ data, setMapCoords }) {
  const [kiinteistot, setKiinteistot] = useState([]);
  const [selectedRakennukset, setSelectedRakennukset] = useState({});
  
  const [showReport, setShowReport] = useState(false);
  const [reportRakennus, setReportRakennus] = useState(null);

  const [korttiNappi, setKorttiNappi] = useState(false)



  //For alt ui 
  const [selectedRakennus, setSelectedRakennus] = useState({});
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

  const handleExport = () => {
    const selectedData = [];
    kiinteistot.forEach(kiinteisto => {
      kiinteisto.rakennukset?.forEach(rakennus => {
        if (selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus?.value]) {
          selectedData.push(rakennus);
        }
      });
    });
    selectedData.forEach(exportToExcel);
  };


  const handleCreateReport = () => {
    let selected = null;
    kiinteistot.forEach(kiinteisto => {
      kiinteisto.rakennukset?.forEach(rakennus => {
        if (selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus?.value]) {
          selected = rakennus;
        }
      });
    });
    if (selected) {
      setReportRakennus(selected);
      setShowReport(true);
    } else {
      alert("Valitse ensin rakennus");
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

      {kiinteistot.map((kiinteisto, kiinteistoIndex) => (
        <div key={kiinteistoIndex} className="kiinteistocard card mb-4 p-2 border border-primary bg-dark text-white p-1">
          <div className="card-header d-flex flex-column align-items-center">
            <p className="h4 text-center">Kiinteistö <span className='text-decoration-underline'>{kiinteisto?.id_esitysmuoto_kiinteistotunnus || "N/A"}</span>
              <button className="btn btn-outline-secondary btn-sm align-items-center ms-2" onClick={() => copyText(kiinteisto?.id_esitysmuoto_kiinteistotunnus)}>
                <i className="bi bi-clipboard me-2"></i> Kopioi
              </button>
            </p>

            <button type="button" className="btn btn-success mt-2" onClick={() => luoKortti(kiinteisto)}> 
                Luo taloyhtiökortti
            </button>

            <div>{response.length > 0 && (<>{JSON.stringify(response)}</>)}</div>

            {/* {korttiNappi && (<p>{prettifyJson(kiinteisto)}</p>)}
            <div>SPACE</div>
            {korttiNappi && (<p>{prettifyJson(jsonToModelFormat(kiinteisto))}</p>)} */}
          </div>

          {kiinteisto.rakennukset?.length > 0 ? (
            <>
              <div className="d-flex justify-content-between align-items-center p-2">

              </div>

              {kiinteisto.rakennukset.map((rakennus, rakennusIndex) => (
                <div key={rakennusIndex} className="card mb-4 p-2">
                  <div className="card-body">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <label className="d-flex align-items-center gap-2">

                        Rakennus {rakennus.properties.yleistiedot.Rakennustunnus?.value || ''} - {Array.isArray(rakennus.properties.yleistiedot["Kohteen osoitteet"]?.value) ? rakennus.properties.yleistiedot["Kohteen osoitteet"].value.join(", ") : rakennus.properties.yleistiedot["Kohteen osoitteet"]?.value || ''}
                        {" "}{rakennus.properties.yleistiedot["Toimipaikka"]?.value || ''}{` (${rakennus.properties?.rakennustiedot["Rakennusluokitus"].value})`}

                      </label>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setMapCoords(rakennus.geometry?.coordinates)}
                      >
                        <i className="bi bi-geo-alt-fill me-1"></i> Näytä kartalla
                      </button>
                    </div>
                    <div className="card-header d-flex justify-content-between align-items-center">
  <label className="d-flex align-items-center gap-2">
    Rakennus {rakennus.properties.yleistiedot.Rakennustunnus?.value || ''} ...
  </label>

  <div className="d-flex gap-2">
    <button
      className="btn btn-outline-primary btn-sm"
      onClick={() => setMapCoords(rakennus.geometry?.coordinates)}
    >
      <i className="bi bi-geo-alt-fill me-1"></i> Näytä kartalla
    </button>

    <button
      className="btn btn-sm btn-outline-success"
      onClick={() => {
        setReportRakennus(rakennus);
        setShowReport(true);
      }}
    >
      Luo raportti
    </button>
  </div>
</div>


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
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-2">Ei rakennuksia</div>
          )}
        </div>
      ))}

      <Modal show={showReport} onHide={() => setShowReport(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Muokkaa raporttia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reportRakennus && <EditableReport rakennus={reportRakennus} />}
        </Modal.Body>
      </Modal>
    <Modal show={showCreatedModal} onHide={() => setShowCreatedModal(false)} centered backdrop="static">
      <Modal.Body className="text-center">
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
      <p className="mt-2 mb-0">Taloyhtiökortti luotu onnistuneesti!</p>
      </Modal.Body>
    </Modal>
    <div className="d-flex justify-content-between align-items-center mb-3">
      {/* <div>
        <Button variant="outline-primary" onClick={handleSelectAll} className="me-2">
          {Object.keys(selectedRakennukset).length ? "Poista valinnat" : "Valitse kaikki"}
        </Button>
        <Button variant="success" onClick={handleExport} className="me-2">
          <i className="bi bi-file-earmark-excel me-1"></i> Vie Exceliin
        </Button>
        <Button variant="danger" onClick={handleCreateReport}>
          <i className="bi bi-file-earmark-pdf me-1"></i> Luo raportti
        </Button>
      </div> */}
    </div>

    {kiinteistot.map((kiinteisto, kiinteistoIndex) => (
      <Card key={kiinteistoIndex} className="mb-4 shadow border-primary">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Kiinteistö: <span className="fw-bold">{kiinteisto?.id_esitysmuoto_kiinteistotunnus || "N/A"}</span>
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
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={!!selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus?.value]}
                      onChange={() => handleCheckboxChange(rakennus.properties.yleistiedot.Rakennustunnus?.value)}
                    />
                    {rakennus.properties.yleistiedot.Rakennustunnus?.value} -{" "}
                    {Array.isArray(rakennus.properties.yleistiedot["Kohteen osoitteet"]?.value)
                      ? rakennus.properties.yleistiedot["Kohteen osoitteet"].value.join(", ")
                      : rakennus.properties.yleistiedot["Kohteen osoitteet"]?.value || ""}
                    {" "} ({rakennus.properties.rakennustiedot["Rakennusluokitus"].value})
                  </label>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setMapCoords(rakennus.geometry?.coordinates)}
                  >
                    <i className="bi bi-geo-alt-fill me-1"></i> Näytä kartalla
                  </Button>
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

    <Modal show={showReport} onHide={() => setShowReport(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Muokkaa raporttia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reportRakennus && <EditableReport rakennus={reportRakennus} />}
      </Modal.Body>
    </Modal>
  </div>
  );
}

export default Resultdisplay;