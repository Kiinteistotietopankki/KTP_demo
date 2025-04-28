import React, { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion } from 'react-bootstrap';
import exportToExcel from './Excelexport';
import EditableReport from './ReportTemplate';
import exportToPdf from './Pdfexport';
import Modal from 'react-bootstrap/Modal';
import '../App.css';

function Resultdisplay({ data, setMapCoords}) {
    const [kiinteistot, setKiinteistot] = useState([]);

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

    return (
        <div className="mt-4">
            {kiinteistot.map((kiinteisto, kiinteistoIndex) => (
                <div key={kiinteistoIndex} className="kiinteistocard card mb-4 p-2 border border-primary bg-dark text-white p-1">
                    <div className="card-header d-flex gap-3 align-items-center ms-3">
                        <p className="h4">Kiinteistö <span className='text-decoration-underline'>{kiinteisto?.id_esitysmuoto_kiinteistotunnus || "N/A"} </span></p>
                        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center" onClick={() => copyText(kiinteisto?.id_esitysmuoto_kiinteistotunnus)}>
                            <i className="bi bi-clipboard me-2"></i> Kopioi
                        </button>
                    </div>

                    {kiinteisto.rakennukset?.length > 0 ? (
                        kiinteisto.rakennukset.map((rakennus, rakennusIndex) => (
                            <div key={rakennusIndex} className="card mb-4 p-1">
                                <div className="card-body">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                    <span>
                                        Rakennus {rakennus.id_rakennustunnus}{" "}
                                        {Array.isArray(rakennus.properties?.yleistiedot["Kohteen osoitteet"].value)
                                            ? rakennus.properties.yleistiedot["Kohteen osoitteet"].value.join(", ")
                                            : rakennus.properties?.yleistiedot["Kohteen osoitteet"].value
                                        }{" "}
                                        {rakennus.properties?.yleistiedot["Toimipaikka"].value}
                                        {` (${rakennus.properties?.rakennustiedot["Rakennusluokitus"].value})`}
                                    </span>

                                    <button
                                        className="btn btn-outline-primary btn-sm ms-2"
                                        onClick={() => setMapCoords(rakennus.geometry?.coordinates)}
                                        >
                                        <i className="bi bi-geo-alt-fill me-1"></i> Näytä kartalla
                                    </button>

                                    </div> 

                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Yleistiedot</Accordion.Header>
                                            <Accordion.Body>
                                                <Tabletemplate
                                                    properties={rakennus.properties.yleistiedot}
                                                    tableTitle={''}
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>

                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>Tekniset tiedot</Accordion.Header>
                                            <Accordion.Body>
                                                <Tabletemplate
                                                    properties={rakennus.properties.teknisettiedot}
                                                    tableTitle={''}
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>

                                        <Accordion.Item eventKey="2">
                                            <Accordion.Header>Rakennustiedot</Accordion.Header>
                                            <Accordion.Body>
                                                <Tabletemplate
                                                    properties={rakennus.properties.rakennustiedot}
                                                    tableTitle={''}
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>

                                        <Accordion.Item eventKey="3">
                                            <Accordion.Header>Aluetiedot</Accordion.Header>
                                            <Accordion.Body>
                                                <Tabletemplate
                                                    properties={rakennus.properties.aluetiedot}
                                                    tableTitle={''}
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-2">Ei rakennuksia</div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Resultdisplay;
