import React from 'react';
import { Accordion } from 'react-bootstrap';

export default function PropertyInfoAccordion({ card }) {
  const rak = card?.rakennukset_fulls?.[0];

  return (
    <Accordion defaultActiveKey="0" className="mb-4">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Kohteen tiedot</Accordion.Header>
        <Accordion.Body>
          <div className="mb-4 px-2 px-md-4">
            {/* 1. Yleiset tiedot */}
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr><td className="fw-semibold" style={{width:'40%'}}>Kohteen nimi</td><td style={{width:'60%'}}>Asunto Oy Mallila</td></tr>
                  <tr><td className="fw-semibold">Osoitteet</td><td>{rak?.osoite || '—'}</td></tr>
                  <tr><td className="fw-semibold">Toimipaikka</td><td>{rak?.postinumero} {rak?.toimipaikka}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="border-top border-success my-3" style={{ height: '3px' }} />

            {/* 2. Kiinteistötiedot */}
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  {[
                    ['Kiinteistötunnus', card?.kiinteistotunnus || '—'],
                    ['Tontin koko', '50505 m²'],
                    ['Tontin omistaja', 'Mallilla Oy'],
                    ['Yhteystiedot', '0441010101'],
                  ].map(([label, value], idx) => (
                    <tr key={idx}><td className="fw-semibold" style={{width:'40%'}}>{label}</td><td style={{width:'60%'}}>{value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-top border-success my-3" style={{ height: '3px' }} />

            {/* 3. Rakennusten lkm */}
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  {[
                    ['Rakennusten lkm.', card?.rakennukset_fulls?.length || '—'],
                    ['Ulkorakennusten lkm.', card?.rakennukset_fulls?.length || '—'],
                  ].map(([label, value], idx) => (
                    <tr key={idx}><td className="fw-semibold" style={{width:'40%'}}>{label}</td><td style={{width:'60%'}}>{value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-top border-success my-3" style={{ height: '3px' }} />

            {/* 4. Vuodet */}
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  {[
                    ['Rakennusvuosi', rak?.rakennusvuosi || '—'],
                    ['Peruskorjausvuosi', '—'],
                    ['Laajennusvuosi', '—'],
                  ].map(([label, value], idx) => (
                    <tr key={idx}><td className="fw-semibold" style={{width:'40%'}}>{label}</td><td style={{width:'60%'}}>{value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-top border-success my-3" style={{ height: '3px' }} />

            {/* 5. Mitat */}
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  {[
                    ['Kokonaisala', `${rak?.kokonaisala ?? '—'} m²`],
                    ['Kerrosala', `${rak?.kerrosala ?? '—'} m²`],
                    ['Huoneistoala', `${rak?.huoneistoala ?? '—'} m²`],
                    ['Tilavuus', `${rak?.tilavuus ?? '—'} m³`],
                    ['Kerroksia', rak?.kerroksia ?? '—'],
                    ['Kellarikerroksia', '—'],
                  ].map(([label, value], idx) => (
                    <tr key={idx}><td className="fw-semibold" style={{width:'40%'}}>{label}</td><td style={{width:'60%'}}>{value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
