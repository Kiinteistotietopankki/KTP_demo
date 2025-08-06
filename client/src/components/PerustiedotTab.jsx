import React, { useEffect, useState } from 'react'
import { Accordion, Tab, Tabs } from 'react-bootstrap'

export default function PerustiedotTab({card}) {
    const [perustiedotActiveKey, setPerustiedotActiveKey] = useState('Kiinteistö')


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


    {/* <div className=" px-5 mb-4" style={{ maxWidth: '600px', margin: 'auto' }}>
        <div className="flex justify-content-center mt-1 mb-1">
            <p className="fs-5 fw-light">Rakennukset</p>
            <Tabs
                id="taloyhtiokortti-tabs"
                className="mb-0"
                variant="pills"
                defaultActiveKey={card.rakennukset_fulls[0]?.rakennustunnus} // optional default
            >
                {card.rakennukset_fulls.map((rakennus, idx) => (
                <Tab
                    eventKey={rakennus.rakennustunnus}
                    title={rakennus.rakennustunnus || `Rakennus ${idx + 1}`}
                    key={rakennus.id_rakennus || idx}
                >

                </Tab>
                ))}
            </Tabs>
        </div> */}

    </div>
  )
}
