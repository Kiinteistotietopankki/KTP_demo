import React, { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion } from 'react-bootstrap';
import exportToExcel from './Excelexport';
import exportToPdf from './Pdfexport';
import '../App.css';

function ResultdisplayRF({ data }) {
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
                                        </span>
                                    </div>

                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Yleistiedot</Accordion.Header>
                                            <Accordion.Body>
                                                <Tabletemplate properties={rakennus.properties} tableTitle="" />
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
