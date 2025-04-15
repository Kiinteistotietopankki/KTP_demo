import React, { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion } from 'react-bootstrap';
import exportToExcel from './Excelexport';
import exportToPdf from './Pdfexport';
import '../App.css';

function Resultdisplay({ data }) {
    const [rakennukset, setRakennukset] = useState([]);
    const [selectedRakennukset, setSelectedRakennukset] = useState({}); 

    useEffect(() => {
        console.log("Data on result displayssa: ",)
        setRakennukset(data);
    }, [data]);

    // individual selection
    const handleCheckboxChange = (rakennusTunnus) => {
        setSelectedRakennukset(prevState => {
            const updatedSelectedRakennukset = { ...prevState };
            if (updatedSelectedRakennukset[rakennusTunnus]) {
                delete updatedSelectedRakennukset[rakennusTunnus]; 
            } else {
                updatedSelectedRakennukset[rakennusTunnus] = true; 
            }
            return updatedSelectedRakennukset;
        });
    };

    // Select All
    const handleSelectAll = () => {
        if (Object.keys(selectedRakennukset).length === rakennukset.length) {
            setSelectedRakennukset({}); 
        } else {
            const allSelected = {};
            rakennukset.forEach(rakennus => {
                allSelected[rakennus.properties.yleistiedot.Rakennustunnus] = true;
            });
            setSelectedRakennukset(allSelected); 
        }
    };

    // Export selected buildings to Excel
    const handleExport = () => {
        const selectedData = rakennukset.filter(rakennus =>
            selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus]
        );
        selectedData.forEach(rakennus => {
            exportToExcel(rakennus); 
        });
    };
    
    
    const handleExportPdf = () => {
        const selectedData = rakennukset.filter(rakennus =>
            selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus]
        );
        selectedData.forEach(rakennus => {
            exportToPdf(rakennus);
        });
    };

    return (
        <div className="mt-4">
           <div key={'kiinteisto'} className="kiinteistocard card mb-4 p-2 border border-primary">
           <div className="card-header d-flex justify-content-between align-items-center">Kiinteistö xxxxx</div>
            {rakennukset?.length > 0 ? (
                <>
                    <div className="d-flex justify-content-between mb-3">
                        <label >
                            <input
                                type="checkbox"
                                checked={Object.keys(selectedRakennukset).length === rakennukset.length}
                                onChange={handleSelectAll}
                            />
                           <span> Valitse kaikki</span>
                        </label>
                        <div className="d-flex gap-2">
                            <button className="export-button" onClick={handleExport}>
                                Tallenna Excel
                                </button>
                            <button className="export-button" onClick={handleExportPdf}>
                                Tallenna PDF
                            </button>
                        </div>
                    </div>
                    
                    {rakennukset.map((rakennus, index) => (
                        <div key={index} className="card mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                            <label className="d-flex align-items-center gap-2">
                            <input type="checkbox"
                                checked={!!selectedRakennukset[rakennus.properties.yleistiedot.Rakennustunnus]}
                                    onChange={() => handleCheckboxChange(rakennus.properties.yleistiedot.Rakennustunnus)}
                                    />
                                <span>{rakennus.properties.yleistiedot["Kohteen osoite"]} {rakennus.properties.yleistiedot["Toimipaikka"]} / {rakennus.properties.yleistiedot.Rakennustunnus}</span>
                                    </label>

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


                    ))}
                </>
            ) : (
                <div>0 results</div>
            )}
            </div> 
        </div>
    );
}

export default Resultdisplay;
