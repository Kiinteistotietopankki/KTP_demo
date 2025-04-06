import React, { useEffect, useState } from 'react';
// import Table from 'react-bootstrap/Table';
import Tabletemplate from './Tabletemplate';
import { Accordion } from 'react-bootstrap';


function Rakennustable({data}) {

    const [rakennus, setRakennus] = useState([]);

    useEffect(() => {
        // If data is passed as a prop, set it to the state
        if (data) {
            setRakennus(data.features);
            console.log(data.features)
        }

    }, [data]); 

    useEffect(() => {
        console.log('rakennukset: ' + rakennus)
    }, [rakennus]);

    return (
        <div className="mt-4">
            {rakennus.length > 0 ? (
                rakennus.map((feature, index) => {
                    const properties = feature.properties; // Extract properties for each feature

                    // General table headers
                    const generalTableHeaders = [
                        { key: 'permanent_building_identifier', label: 'Rakennustunnus' },
                        { key: 'property_identifier', label: 'Kiinteistötunnus' },
                        { key: 'name', label: 'Kohteen nimi' },
                        { key: 'address', label: 'Kohteen osoite' },
                        { key: 'postcode', label: 'Postinumero' },
                        { key: 'municipality', label: 'Toimipaikka' },
                        { key: 'completion_date', label: 'Rakennusvuosi' },
                        { key: 'total_area', label: 'Kokonaisala (m²)' },
                        { key: 'gross_floor_area', label: 'Kerrosala (m²)' },
                        { key: 'floor_area', label: 'Huoneistoala (m²)' },
                        { key: 'volume', label: 'Tilavuus (m³)' },
                        { key: 'number_of_storeys', label: 'Kerroksia' },
                    ];

                    // Special table headers (separate for specific properties)
                    const luokitukset = [
                        { key: 'main_purpose', label: 'Rakennusluokitus' },
                        { key: 'construction_method', label: 'Runkotapa' },
                        { key: 'usage_status', label: 'Käytössäolotilanne' },
                        { key: 'facade_material', label: 'Julkisivunrakennusaine' },
                        { key: 'heating_method', label: 'Lämmitystapa' },
                        { key: 'heating_energy_source', label: 'Lämmitysenergianlähde' },
                        { key: 'material_of_load_bearing_structures', label: 'Kantavanrakenteen rakennusaine' },
                    ];

                    const aluetiedot = [
                        { key: 'exact_location', label: 'Tarkka sijainti' },
                        { key: 'flood_risk', label: 'Tulvariski' },
                        { key: 'groundwater_area', label: 'Pohjavesialueella' }
                    ];

                    // Get the permanent building identifier to be used as the header for the feature
                    const buildingId = properties.permanent_building_identifier || 'ID not available';

                    return (
                        <div key={index} className="card mb-4">
                            <div className="card-header">Rakennus {buildingId}</div>
                            
                            
                            {/* General Table */}
                            <div className="tablecontainer card-body">
                                
                                

                                <Accordion defaultActiveKey={['0']} alwaysOpen='true'>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Yleistiedot</Accordion.Header>
                                        <Accordion.Body>
                                            <Tabletemplate headers={generalTableHeaders} properties={properties} />
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Luokitukset</Accordion.Header>
                                            <Accordion.Body>
                                                <Tabletemplate headers={luokitukset} properties={properties} />
                                            </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>Aluetiedot</Accordion.Header>
                                            <Accordion.Body>
                                                <Tabletemplate headers={aluetiedot} properties={properties} />
                                            </Accordion.Body>
                                    </Accordion.Item>
                                    </Accordion>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default Rakennustable;