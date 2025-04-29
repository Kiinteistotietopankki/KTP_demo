import React, { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion } from 'react-bootstrap';
import exportToExcel from './Excelexport';
import exportToPdf from './Pdfexport';
import EditableReport from './ReportTemplate';
import Modal from 'react-bootstrap/Modal';
import '../App.css';

function Resultdisplay({ data, setMapCoords }) {
  const [kiinteistot, setKiinteistot] = useState([]);
  const [selectedRakennukset, setSelectedRakennukset] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [reportRakennus, setReportRakennus] = useState(null);



    useEffect(() => {
        if (data.length > 0){
            setKiinteistot(data);
        }
    }, [data]);

    // Initial map view
    useEffect(() => {
        if (kiinteistot.length > 0){
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

  return (
    <div className="mt-4">
      {kiinteistot.map((kiinteisto, kiinteistoIndex) => (
        <div key={kiinteistoIndex} className="kiinteistocard card mb-4 p-2 border border-primary bg-dark text-white p-1">
          <div className="card-header d-flex gap-3 align-items-center ms-2">
            <p className="h4">Kiinteistö <span className='text-decoration-underline'>{kiinteisto?.id_esitysmuoto_kiinteistotunnus || "N/A"}</span></p>
            <button className="btn btn-outline-secondary btn-sm d-flex align-items-center" onClick={() => copyText(kiinteisto?.id_esitysmuoto_kiinteistotunnus)}>
              <i className="bi bi-clipboard me-2"></i> Kopioi
            </button>
          </div>

          {kiinteisto.rakennukset?.length > 0 ? (
            <>
              <div className="d-flex justify-content-between align-items-center p-2">
                <label className="d-flex align-items-center gap-2 ms-4">
                    <input
                        type="checkbox"
                    checked={
                    kiinteisto.rakennukset.every(rakennus => selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus?.value])
                        }
                        onChange={handleSelectAll}
                        />

                    
                    Valitse kaikki rakennukset
                </label>
                <div className="d-flex gap-2">
                  <button className="export-button" onClick={handleCreateReport}>Luo raportti</button>
                  <button className="export-button" onClick={handleExport}>Tallenna Excel</button>
                 
                </div>
              </div>

              {kiinteisto.rakennukset.map((rakennus, rakennusIndex) => (
                <div key={rakennusIndex} className="card mb-4 p-2">
                  <div className="card-body">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <label className="d-flex align-items-center gap-2">
                      <input
                type="checkbox"
                    checked={!!selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus?.value]}
                    onChange={() => handleCheckboxChange(rakennus.properties.yleistiedot.Rakennustunnus?.value)}
                        />

                        
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
    </div>
  );
}

export default Resultdisplay;
