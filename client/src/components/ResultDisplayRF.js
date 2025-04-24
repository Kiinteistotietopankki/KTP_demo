import React, { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion, Table } from 'react-bootstrap';
import exportToExcel from './Excelexport';
import exportToPdf from './Pdfexport';
import '../App.css';

function ResultdisplayRF({ data, setMapCoords}) {
    const [kiinteistot, setKiinteistot] = useState([]);

    useEffect(() => {
        setKiinteistot(data);
    }, [data]);


    return (
        <div className="mt-4">
            {kiinteistot.map((kiinteisto, kiinteistoIndex) => (
                <div key={kiinteistoIndex} className="kiinteistocard card mb-4 p-2 border border-primary">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        Kiinteistö {kiinteisto?.id_kiinteistotunnus || "N/A"}
                    </div>

                    {kiinteisto.rakennukset?.length > 0 ? (
                        kiinteisto.rakennukset.map((rakennus, rakennusIndex) => (
                            <div key={rakennusIndex} className="card mb-4">
                                <div className="card-body">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                    <span>
                                        Rakennus {rakennus.id_rakennustunnus} -{" "}
                                        {rakennus.properties?.KohteenOsoite}{" "}
                                        {rakennus.properties?.Toimipaikka}
                                        {` (${rakennus.properties?.Rakennusluokitus})`}
                                    </span>
                                    <button
                                    className="btn btn-outline-primary btn-sm ms-2"
                                    onClick={() => setMapCoords(rakennus.geometry?.coordinates)}
                                    >
                                        Näytä kartalla
                                    </button>
                                    </div> 

                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Yleistiedot</Accordion.Header>
                                            <Accordion.Body>
                                                
                                            {/* <h1>{rakennus.properties?.Toimipaikka}</h1>
                                            <h1>{rakennus.sources?.Toimipaikka}</h1> */}

                                            <Table striped bordered responsive hover style={{ fontSize: '0.8em' }}>
                                                <thead>
                                                <tr>
                                                    <th>Nimi</th>
                                                    <th>Arvo</th>
                                                    <th>Lähde</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>Rakennusluokitus</td>
                                                    <td>{rakennus.properties?.Rakennusluokitus}</td>
                                                    <td>{rakennus.sources?.Rakennusluokitus}</td>
                                                </tr>

                                                </tbody>
                                            </Table>

                                            
                                            <Table striped bordered responsive hover style={{ fontSize: '0.8em' }}>
                                                <thead>
                                                <tr>
                                                    <th>Nimi</th>
                                                    <th>Arvo</th>
                                                    <th>Lähde</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>{rakennus.properties?.KohteenOsoite}</td>
                                                    <td>{rakennus.properties?.Toimipaikka}</td>
                                                    <td>{rakennus.properties?.Postinumero}</td>
                                                </tr>

                                                </tbody>
                                            </Table>

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

export default ResultdisplayRF;
