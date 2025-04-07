import React, { useEffect, useState } from 'react';
import Tabletemplate from './Tabletemplate';
import { Accordion } from 'react-bootstrap';

function Rakennustable({ data }) {
    const [rakennukset, setRakennukset] = useState([]);
    


    useEffect(() => {
        if (data) {
            const transformedData = data.features.map(feature => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: feature.geometry.coordinates
                },
                properties: {
                    yleistiedot: {
                        "Rakennustunnus": feature.properties.permanent_building_identifier || null,
                        "Kiinteistötunnus": feature.properties.property_identifier || null,
                        "Kohteen nimi": null,
                        "Kohteen osoite": null, 
                        "Postinumero" : null, 
                        "Toimipaikka": null,
                    },
                    teknisettiedot: {
                        "Rakennusvuosi": feature.properties.completion_date ? feature.properties.completion_date.split("-")[0] : null,
                        "Kokonaisala (m²)": feature.properties.total_area || null,
                        "Kerrosala (m²)": feature.properties.gross_floor_area || null,
                        "Huoneistoala (m²)": feature.properties.floor_area || null,
                        "Tilavuus (m³)": feature.properties.volume || null,
                        "Kerroksia": feature.properties.number_of_storeys || null,
                    },
                    rakennustiedot: {
                        "Rakennusluokitus": feature.properties.main_purpose || null,
                        "Runkotapa": feature.properties.construction_method || null,
                        "Käytössäolotilanne": feature.properties.usage_status || null,
                        "Julkisivun rakennusaine": feature.properties.facade_material || null,
                        "Lämmitystapa": feature.properties.heating_method || null,
                        "Lämmitysenergianlähde": feature.properties.heating_energy_source || null,
                        "Kantavanrakenteen rakennusaine": feature.properties.material_of_load_bearing_structures || null,
                    },
                    aluetiedot: {
                        "Tulvariski": null, 
                        "Pohjavesialueella": null
                    }
                }
            }));

            setRakennukset(transformedData);
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

export default Rakennustable;
