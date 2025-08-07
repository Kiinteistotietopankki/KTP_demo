import React, { useEffect, useState } from 'react'
import {Button, Modal, Tab, Tabs } from 'react-bootstrap'
import RakennustietoRow from './RakennustietoRow';
import rakennusKoodit from '../assets/rakennusKoodit';
import MapModalWrapper from './MapModalWrapper';
import TilastoTable from './TilastoTable';

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


    return (

        <div className="container-fluid px-3 px-md-4 mb-4">
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
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
                                ['Tilavuus', `${card?.rakennukset_fulls[0]?.tilavuus} m³`],
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

                {/* Rakennukset ala-tabi perustiedoissa */}

                {perustiedotActiveKey === 'Rakennukset' && card?.rakennukset_fulls?.length > 0 && (
                <div className="flex mt-3 table-responsive-text">
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

                {/* Tilastoja */}

                <div className="border-top border-success my-3" style={{ height: '3px' }} />
               
                <TilastoTable
                    kunta={card?.rakennukset_fulls[0]?.toimipaikka}
                    chartLabel={'pientalojen kauppahinnat'}
                />

                {/* Modaali joka avataan ku avataan jonkun rakennuksen tiedot */}
                
                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    centered
                    fullscreen="md-down"
                    size="xl"
                    contentClassName="border-success rounded-3"
                >
                <Modal.Header closeButton className="bg-success bg-opacity-10 border-success">
                    <Modal.Title className="text-success">Rakennuksen tiedot</Modal.Title>
                </Modal.Header>
                
                {selectedRakennus?.sijainti?.coordinates?.[1] && (
                <MapModalWrapper coords={[selectedRakennus.sijainti.coordinates[1], selectedRakennus.sijainti.coordinates[0]]} />
                )}
                                

                <Modal.Body className="px-4 py-3">
                    {selectedRakennus ? (
                    <dl className="row gy-3">
                        {/* Identification */}
                        <RakennustietoRow
                        otsikko="Rakennustunnus"
                        field="rakennustunnus"
                        rakennus={selectedRakennus}
                        editable={true}
                        showSource={true}
                        />

                        {/* Address */}
                        <RakennustietoRow otsikko="Osoite" field="osoite" rakennus={selectedRakennus} editable showSource />
                        <RakennustietoRow otsikko="Toimipaikka" field="toimipaikka" rakennus={selectedRakennus} editable showSource />
                        <RakennustietoRow otsikko="Postinumero" field="postinumero" rakennus={selectedRakennus} editable showSource />

                        <div className="border-top border-success my-3" />

                        {/* Basic Info */}
                        <RakennustietoRow
                        otsikko="Rakennusluokitus"
                        field="rakennusluokitus"
                        rakennus={selectedRakennus}
                        editable
                        showSource
                        options={rakennusKoodit.rakennusluokitus}
                        />
                        <RakennustietoRow otsikko="Rakennusvuosi" field="rakennusvuosi" rakennus={selectedRakennus} editable showSource />

                        <div className="border-top border-success my-3" />

                        {/* Size & Volume */}
                        <RakennustietoRow otsikko="Kokonaisala (m²)" field="kokonaisala" rakennus={selectedRakennus} editable showSource />
                        <RakennustietoRow otsikko="Kerrosala (m²)" field="kerrosala" rakennus={selectedRakennus} editable showSource />
                        <RakennustietoRow otsikko="Huoneistoala (m²)" field="huoneistoala" rakennus={selectedRakennus} editable showSource />
                        <RakennustietoRow otsikko="Tilavuus (m³)" field="tilavuus" rakennus={selectedRakennus} editable showSource />
                        <RakennustietoRow otsikko="Kerroksia" field="kerroksia" rakennus={selectedRakennus} editable showSource />

                        <div className="border-top border-success my-3" />

                        {/* Structure */}
                        <RakennustietoRow
                        otsikko="Runkotapa"
                        field="runkotapa"
                        rakennus={selectedRakennus}
                        editable
                        showSource
                        options={rakennusKoodit.rakentamistapa}
                        />
                        <RakennustietoRow
                        otsikko="Käyttötilanne"
                        field="kayttotilanne"
                        rakennus={selectedRakennus}
                        editable
                        showSource
                        options={rakennusKoodit.kayttotilanne}
                        />

                        {/* Materials & Heating */}
                        <RakennustietoRow
                        otsikko="Julkisivumateriaali"
                        field="julkisivumateriaali"
                        rakennus={selectedRakennus}
                        editable
                        showSource
                        options={rakennusKoodit.julkisivumateriaali}
                        />
                        <RakennustietoRow
                        otsikko="Lämmitystapa"
                        field="lammitystapa"
                        rakennus={selectedRakennus}
                        editable
                        showSource
                        options={rakennusKoodit.lammitystapa}
                        />
                        <RakennustietoRow
                        otsikko="Lämmitysenergialähde"
                        field="lammitysenergialahde"
                        rakennus={selectedRakennus}
                        editable
                        showSource
                        options={rakennusKoodit.lammitysenergialahde}
                        />
                        <RakennustietoRow
                        otsikko="Rakennusaine"
                        field="rakennusaine"
                        rakennus={selectedRakennus}
                        editable
                        showSource
                        options={rakennusKoodit.rakennusaine}
                        />
                    </dl>
                    ) : (
                    <p>Ei tietoja</p>
                    )}
                </Modal.Body>

                <Modal.Footer className="bg-light">
                    <Button variant="secondary" onClick={handleCloseModal}>
                    Sulje
                    </Button>
                </Modal.Footer>
                </Modal>
                </div>
                )}
            </div>
        
            </div>
        </div>
    )
}
