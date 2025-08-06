import React, { useEffect, useState } from 'react'
import { Accordion, Button, Modal, Tab, Tabs } from 'react-bootstrap'
import RakennustietoRow from './RakennustietoRow';

export default function PerustiedotTab({card}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRakennus, setSelectedRakennus] = useState(null);

  const handleOpenModal = (rakennus) => {
    setSelectedRakennus(rakennus);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRakennus(null);
  };

    const [perustiedotActiveKey, setPerustiedotActiveKey] = useState('Kiinteistö')
    const [buildingChoise, setBuildingChoise] = useState(card?.rakennukset_fulls[0]?.rakennustunnus)

    // useEffect(() => {
    //   setBuildingChoise(card?.rakennukset_fulls[0]?.rakennustunnus)
    // }, [card])
    

    return (

        <div className=" px-5 mb-4" style={{ maxWidth: '600px', margin: 'auto' }}>
                <div className="d-flex justify-content-center mt-1 mb-1">
                <Tabs
                    activeKey={perustiedotActiveKey}
                    onSelect={(k) => setPerustiedotActiveKey(k)}
                    id="taloyhtiokortti-tabs"
                    className="mb-0 custom-tabs2"
                    variant="pills"
                >
                    <Tab eventKey="Kiinteistö" title={<span className="text-white">Kiinteistö</span>} />
                    <Tab eventKey="Rakennukset" title={<span className="text-white">Rakennukset</span>} />
                </Tabs>
                </div>

            <div className="mt-1">
            {perustiedotActiveKey === 'Kiinteistö' && (
                <div>
                    {card && (
                        <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                            <tbody>
                                {[
                                ['Kohteen nimi', 'Asunto Oy Mallila'],
                                ['Osoitteet', `${card?.rakennukset_fulls[0]?.osoite}`],
                                ['Toimipaikka',` ${card?.rakennukset_fulls[0]?.postinumero} ${card?.rakennukset_fulls[0]?.toimipaikka}`],
                                
                                ].map(([label, value]) => (
                                <tr key={label} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td
                                    className="text-start fw-semibold pe-3"
                                    style={{ width: '40%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                                    >
                                    {label}
                                    </td>
                                    <td className="text-start" style={{ verticalAlign: 'middle' }}>
                                    {value || '—'}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="border-top border-success my-3" style={{ height: '3px' }} />
                    
                    {card && (
                        <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                            <tbody>
                                {[
                                ['Kiinteistötunnus', `${card?.kiinteistotunnus}`],
                                ['Tontin koko', `${50505} m²`],
                                ['Tontin omistaja', `Mallilla Oy`],
                                ['Yhteystiedot', `0441010101`],
                                
                                ].map(([label, value]) => (
                                <tr key={label} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td
                                    className="text-start fw-semibold pe-3"
                                    style={{ width: '40%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                                    >
                                    {label}
                                    </td>
                                    <td className="text-start" style={{ verticalAlign: 'middle' }}>
                                    {value || '—'}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                    <div className="border-top border-success my-3" style={{ height: '3px' }} />

                    {card && (
                        <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                            <tbody>
                                {[
                                ['Rakennusten lkm.', `${card?.rakennukset_fulls.length}`],
                                ['Ulkorakennusten lkm.', `${card?.rakennukset_fulls.length}`],
                                
                                ].map(([label, value]) => (
                                <tr key={label} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td
                                    className="text-start fw-semibold pe-3"
                                    style={{ width: '40%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                                    >
                                    {label}
                                    </td>
                                    <td className="text-start" style={{ verticalAlign: 'middle' }}>
                                    {value || '—'}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="border-top border-success my-3" style={{ height: '3px' }} />

                    {card && (
                        <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                            <tbody>
                                {[
                                ['Rakennusvuosi.', `${card?.rakennukset_fulls[0]?.rakennusvuosi}`],
                                ['Peruskorjausvuosi', ''],
                                ['Laajennusvuosi', ''],
                                
                                ].map(([label, value]) => (
                                <tr key={label} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td
                                    className="text-start fw-semibold pe-3"
                                    style={{ width: '40%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                                    >
                                    {label}
                                    </td>
                                    <td className="text-start" style={{ verticalAlign: 'middle' }}>
                                    {value || '—'}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="border-top border-success my-3" style={{ height: '3px' }} />

                    {card && (
                        <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                            <tbody>
                                {[
                                ['Kokonaisala', `${card?.rakennukset_fulls[0]?.kokonaisala} m²`],
                                ['Kerrosala', `${card?.rakennukset_fulls[0]?.kerrosala} m²`],
                                ['Huoneistoala', `${card?.rakennukset_fulls[0]?.huoneistoala} m²`],
                                ['Tilavuus', `${card?.rakennukset_fulls[0]?.tilavuus} m²`],
                                ['Kerroksia', `${card?.rakennukset_fulls[0]?.kerroksia}`],
                                ['Kellarikerroksia', `-`],
                                
                                ].map(([label, value]) => (
                                <tr key={label} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td
                                    className="text-start fw-semibold pe-3"
                                    style={{ width: '40%', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                                    >
                                    {label}
                                    </td>
                                    <td className="text-start" style={{ verticalAlign: 'middle' }}>
                                    {value || '—'}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>
            )}

                {perustiedotActiveKey === 'Rakennukset' && card?.rakennukset_fulls?.length > 0 && (
                <div className="table-responsive-text">
                    <table className="table table-sm" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                    <thead>
                        <tr>
                        <th>Rakennustunnus</th>
                        <th>Rakennusluokitus</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {card.rakennukset_fulls.map((rakennus, idx) => (
                        <tr key={rakennus.rakennustunnus || idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                            <td className="text-start fw-semibold pe-3" style={{ verticalAlign: 'middle' }}>
                            {rakennus?.rakennustunnus || '—'}
                            </td>
                            <td className="text-start" style={{ verticalAlign: 'middle' }}>
                            {rakennus?.rakennusluokitus || '—'}
                            </td>
                            <td className="text-start" style={{ verticalAlign: 'middle' }}>
                                <Button variant="success" onClick={() => handleOpenModal(rakennus)}>
                                        Tiedot
                                </Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>

                {/* Modaali joka avataan ku avataan jonkun rakennuksen tiedot */}
                
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                    <Modal.Title> Rakennuksen tiedot </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {selectedRakennus ? (
                        <>
                        <RakennustietoRow otsikko="Rakennustunnus" field="rakennustunnus" rakennus={selectedRakennus} editable={true} showSource={true} />
                        <RakennustietoRow otsikko="Rakennusluokitus" field="rakennusluokitus" rakennus={selectedRakennus} editable={true} showSource={true} />
                        <RakennustietoRow otsikko="Osoite" field="osoite" rakennus={selectedRakennus} editable={true} showSource={true} />
                        {/* Add more fields here as needed */}
                        </>
                    ) : (
                        <p>Ei tietoja</p>
                    )}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Sulje
                    </Button>
                    </Modal.Footer>
                </Modal>
                </div>
                )}
            </div>
        

        </div>
    )
}
