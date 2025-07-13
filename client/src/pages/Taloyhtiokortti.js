import { useEffect, useRef, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Tab, Tabs } from 'react-bootstrap';
import StickyAfterScroll from '../components/Stickyafterscroll';
import { getKiinteistoWhole } from '../api/api';
import PerustiedotAccordion from '../components/PerustiedotAccordion';
import { Button, Modal } from 'react-bootstrap';
import PropertyDetailsForm from '../components/ReportTemplate'; 
import TilastoTable from '../components/TilastoTable';
import TulosteetTab from '../components/TulosteetTab';
import MMLTabFetcher from '../components/MMLTabFetcher';


function Taloyhtiokortti() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const hasFetched = useRef(false);
  const [showPTSModal, setShowPTSModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
  const [mapCoords, setMapCoords] = useState([]);
const [activeTab, setActiveTab] = useState('perustiedot');
const [existingPTSData, setExistingPTSData] = useState(null);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    getKiinteistoWhole(id)
      .then(res => {
        setCard(res.data);
        const coords = res.data?.rakennukset_fulls[0]?.sijainti?.coordinates;
        if (coords) setMapCoords([coords[1], coords[0]]);
      })
      .catch(err => console.error('API error:', err));

      console.log(card)
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
           <div className="p-3">
  <Button
    variant="outline-primary"
    onClick={() => setShowReportModal(true)}
  >
    ➕ Luo raportti
  </Button>

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
      <PropertyDetailsForm
        rakennus={rakennus}
        kiinteistotunnus={card.kiinteistotunnus}
      />
    </Modal.Body>
  </Modal>
</div>

          </Tab>

          <Tab eventKey="kiinteistotiedot" title="Kiinteistötiedot">
            <MMLTabFetcher kiinteistotunnus={card?.kiinteistotunnus}></MMLTabFetcher>
          </Tab>
          <Tab eventKey="tulosteet" title="Hae tulosteita">
            <TulosteetTab kiinteistotunnus={card?.kiinteistotunnus}></TulosteetTab>
          </Tab>
          <Tab eventKey="pts" title="PTS">
            <div className="p-3">Tähän tulee PTS-tiedot.</div>
          </Tab>
          <Tab eventKey="tilastot" title="Tilastot">
            <div className="container mt-4">
              <TilastoTable indicator={2313} kunta={card?.rakennukset_fulls[0]?.toimipaikka} chartLabel={'asuinpientalokiinteistöt asemakaava-alueella - rakennetut kohteet (kauppahinta mediaani €)'}></TilastoTable>
              <TilastoTable indicator={2503} kunta={card?.rakennukset_fulls[0]?.toimipaikka} chartLabel={'asuinpientalokiinteistöt haja-asutusalueella - rakennetut kohteet (kauppahinta mediaani €)'}></TilastoTable>
            </div>
          </Tab>
          <Tab eventKey="rhtiedot" title="RH-tiedot">
            <div className="p-3">Tähän tulee RH-tiedot.</div>
          </Tab>
          <Tab eventKey="pts" title="PTS">
          <div className="p-3">
            <Button
              variant="outline-primary"
              onClick={() => setShowPTSModal(true)}
            >
              ➕ Luo uusi PTS
            </Button>

            <Modal
              show={showPTSModal}
              onHide={() => setShowPTSModal(false)}
              size="xl"
              backdrop="static"
            >
              <Modal.Header closeButton>
                <Modal.Title>Luo PTS-raportti</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <PropertyDetailsForm rakennus={rakennus} kiinteistotunnus={card.kiinteistotunnus} 
                initialTab="pts"/>
              </Modal.Body>
            </Modal>
          </div>
        </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Taloyhtiokortti;