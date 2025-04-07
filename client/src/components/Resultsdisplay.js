import React, { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion } from 'react-bootstrap';

// Hakujen tulokset näytetään tässä komponetissa

function Resultdisplay({ data }) {

    const [rakennukset, setRakennukset] = useState([]);


    useEffect(() => {
        if (data.length > 0){
            setRakennukset(data)
        }
    }, [data]);

    return (
        <div className="mt-4">
            {rakennukset.length > 0 ? (
                <>
                    {rakennukset.map((rakennus, index) => (
                        <div key={index} className="card mb-4">
                            {/* Pass the entire basicInformation object */}
                            <div className="card-header">Rakennus {rakennus.properties.yleistiedot.Rakennustunnus}</div>

                                <Accordion defaultActiveKey={['0']} alwaysOpen='true'>
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
                <p>No data available</p>
            )}
        </div>
    );
}

export default Resultdisplay;
