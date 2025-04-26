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

    const [selectedRakennukset, setSelectedRakennukset] = useState({}); 
    const [showReport, setShowReport] = useState(false);
    const [reportRakennus, setReportRakennus] = useState(null);

    useEffect(() => {
        setKiinteistot(data);
    }, [data]);


    // // individual selection
    // const handleCheckboxChange = (rakennusTunnus) => {
    //     setSelectedRakennukset(prevState => {
    //         const updatedSelectedRakennukset = { ...prevState };
    //         if (updatedSelectedRakennukset[rakennusTunnus]) {
    //             delete updatedSelectedRakennukset[rakennusTunnus]; 
    //         } else {
    //             updatedSelectedRakennukset[rakennusTunnus] = true; 
    //         }
    //         return updatedSelectedRakennukset;
    //     });
    // };

    // // Select All
    // const handleSelectAll = () => {
    //     if (Object.keys(selectedRakennukset).length === rakennukset.length) {
    //         setSelectedRakennukset({}); 
    //     } else {
    //         const allSelected = {};
    //         rakennukset.forEach(rakennus => {
    //             allSelected[rakennus.properties.yleistiedot.Rakennustunnus] = true;
    //         });
    //         setSelectedRakennukset(allSelected); 
    //     }
    // };

    // // Export selected buildings to Excel
    // const handleExport = () => {
    //     const selectedData = rakennukset.filter(rakennus =>
    //         selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus]
    //     );
    //     selectedData.forEach(rakennus => {
    //         exportToExcel(rakennus); 
    //     });
    // };
    
    
    // const handleExportPdf = () => {
    //     const selectedData = rakennukset.filter(rakennus =>
    //         selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus]
    //     );
    //     selectedData.forEach(rakennus => {
    //         exportToPdf(rakennus);
    //     });
    // };
    // const handleCreateReport = () => {
    //     const selected = rakennukset.find(rakennus =>
    //         selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus]
    //     );
    //     if (selected) {
    //         setReportRakennus(selected);
    //         setShowReport(true);
    //     } else {
    //         alert("Valitse ensin kiinteistö");
    //     }
    // };

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
                                        Näytä kartalla
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
