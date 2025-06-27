import { useEffect, useRef, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Tab, Tabs } from 'react-bootstrap';
import StickyAfterScroll from '../components/Stickyafterscroll';
import { getKiinteistoWhole } from '../api/api';
import PerustiedotAccordion from '../components/PerustiedotAccordion';
import PropertyDetailsForm from '../components/ReportTemplate'; 
import Modal from 'react-bootstrap/Modal';

function Taloyhtiokortti() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const hasFetched = useRef(false);

  const [mapCoords, setMapCoords] = useState([]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [selectedRakennusForReport, setSelectedRakennusForReport] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    useEffect(() => {

    getKiinteistoWhole(id)
      .then(res => {
        setCard(res.data);
        const coords = res.data?.rakennukset_fulls[0]?.sijainti?.coordinates;
        if (coords) setMapCoords([coords[1], coords[0]]);
      })
      .catch(err => console.error('API error:', err));
  }, [id]);

  if (!card) return <div className="text-center mt-5">Ladataan tietoja...</div>;

  const rakennus = card.rakennukset_fulls[0];

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold text-primary">
          Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h2>
      </div>

      {/* Info + Map */}
        <div className="p-4 bg-white border rounded-4 shadow-sm">
        <div className="row g-4">
            <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-center">
            <h1 className="fw-bold text-dark" style={{ fontSize: '2rem', lineHeight: 1.1 }}>
                {rakennus?.osoite} {rakennus?.toimipaikka}
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.5rem' }}>
                Kiinteistötunnus: {card.kiinteistotunnus}
            </p>
            </div>
            <div className="col-md-6">
            <MapVisual pos={[65.00816937, 25.46030678]} coords={mapCoords} />
            </div>
        </div>
        </div>

      {/* Tabs */}
      <div className="mt-4 bg-white border rounded-4 shadow-sm p-3">
        <Tabs defaultActiveKey="perustiedot" id="taloyhtiokortti-tabs" className="mb-3" fill>
          <Tab eventKey="perustiedot" title="Perustiedot">
            <PerustiedotAccordion kiinteisto={card} setMapCoodinates={setMapCoords} />
          </Tab>
          <Tab eventKey="dokumentit" title="Dokumentit ja raportit">
            <div className="p-3">Tähän tulee dokumentit ja raportit.</div>
          </Tab>
          <Tab eventKey="kiinteistotiedot" title="Kiinteistötiedot">
            <div className="p-3">Tähän tulee kiinteistötiedot.</div>
          </Tab>
          <Tab eventKey="rhtiedot" title="RH-tiedot">
            <div className="p-3">Tähän tulee RH-tiedot.</div>
          </Tab>
          <Tab eventKey="pts" title="PTS">
            <div className="p-3">Tähän tulee PTS-tiedot.</div>
          </Tab>
        </Tabs>
      </div>
    </div>

            <div className='row border border-danger mt-3'>
                <Tabs
                    defaultActiveKey="perustiedot"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
 
                    <Tab eventKey="perustiedot" title="Perustiedot">
                        <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Tunnus</th>
                                        {/* <th scope="col">Rakennusvuosi</th>
                                        <th scope="col">Kerroksia</th> */}
                                        <th scope="col">Kokonaisala m²</th>
                                        <th scope="col">Kerrosala m²</th>
                                        <th scope="col">Huoneistoala m²</th>
                                        <th scope="col">Tilavuus m³</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        let totalKerroksia = 0;
                                        let totalKokonaisala = 0;
                                        let totalKerrosala = 0;
                                        let totalHuoneistoala = 0;
                                        let totalTilavuus = 0;

                                        const rows = card?.rakennukset.map(rakennus => {
                                            const tiedot = rakennus.rakennustiedot?.[0] || {};
                                            const kerroksia = Number(tiedot.kerroksia) || 0;
                                            const kokonaisala = Number(tiedot.kokonaisala) || 0;
                                            const kerrosala = Number(tiedot.kerrosala) || 0;
                                            const huoneistoala = Number(tiedot.huoneistoala) || 0;
                                            const tilavuus = Number(tiedot.tilavuus) || 0;

                                            totalKerroksia += kerroksia;
                                            totalKokonaisala += kokonaisala;
                                            totalKerrosala += kerrosala;
                                            totalHuoneistoala += huoneistoala;
                                            totalTilavuus += tilavuus;

                                            return (
                                                <tr key={rakennus.id_rakennus}>
                                                    <th scope="row">{rakennus.rakennustunnus}</th>
                                                    {/* <td>{tiedot.rakennusvuosi || 'Ei tiedossa'}</td>
                                                    <td>{kerroksia}</td> */}
                                                    <td>{kokonaisala}</td>
                                                    <td>{kerrosala}</td>
                                                    <td>{huoneistoala}</td>
                                                    <td>{tilavuus}</td>
                                                    <td>
                                                    <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setSelectedRakennusForReport(rakennus);
                                                        setShowReportModal(true);
                                                    }}
                                                    >
                                                    Luo raportti
                                                    </button>
                                                     </td>
                                                </tr>
                                            );
                                        });

                                        return (
                                            <>
                                                {rows}
                                                <tr>
                                                    <th scope="row">Yhteensä</th>
                                                    {/* <td>-</td>
                                                    <td>-</td> */}
                                                    <td>{totalKokonaisala}</td>
                                                    <td>{totalKerrosala}</td>
                                                    <td>{totalHuoneistoala}</td>
                                                    <td>{totalTilavuus}</td>
                                                </tr>
                                            </>
                                        );
                                    })()}
                                </tbody>
                            </table>
                            <Modal
                                    show={showReportModal}
                                    onHide={() => setShowReportModal(false)}
                                    size="xl"
                                    backdrop="static"
                                    >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Luo raportti</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {selectedRakennusForReport && (
                                        <PropertyDetailsForm rakennus={selectedRakennusForReport} />
                                        )}
                                    </Modal.Body>
                                    </Modal>

                    </Tab>
                    <Tab eventKey="dokumentit" title="Dokumentit ja raportit">
                        Tab content for Dokumentit ja raportit
                    </Tab>
                    <Tab eventKey="kiinteistotiedot" title="Kiinteistotiedot">
                        Tab content for Kiinteistotiedot
                    </Tab>
                    <Tab eventKey="rhtiedot" title="RH-tiedot">
                        Tab content for RH-tiedot
                    </Tab>
                    <Tab eventKey="pts" title="PTS">
                        Tab content for PTS
                    </Tab>
                </Tabs>

            </div>
        </div>
    </>
  );
}

export default Taloyhtiokortti;
