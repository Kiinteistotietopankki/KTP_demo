import { useEffect, useRef, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Tab, Tabs } from 'react-bootstrap';
import { getKiinteistoWhole } from '../api/api';
import PerustiedotAccordion from '../components/PerustiedotAccordion';
import { Button, Modal } from 'react-bootstrap';
import PropertyDetailsForm from '../components/ReportTemplate'; 
import TilastoTable from '../components/TilastoTable';
import TulosteetTab from '../components/TulosteetTab';
import MMLTabFetcher from '../components/MMLTabFetcher';
import PTSLongTermTable from '../components/PTS/PTSLongTermTable';

function Taloyhtiokortti() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const hasFetched = useRef(false);
  const [hasPTSData, setHasPTSData] = useState(null);
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
  <button className="btn btn-success" onClick={() => setShowReportModal(true)}
  >
    ➕ Luo raportti
  </button>

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
        rakennusData={card}
      />
    </Modal.Body>
  </Modal>
</div>

          </Tab>

          <Tab eventKey="kiinteistotiedot" title="Kiinteistötiedot">
            <MMLTabFetcher kohdetunnus={card?.kiinteistotunnus}></MMLTabFetcher>
          </Tab>
          <Tab eventKey="tulosteet" title="Hae tulosteita">
            <TulosteetTab kiinteistotunnus={card?.kiinteistotunnus}></TulosteetTab>
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
<Tab
  eventKey="pts"
  title="PTS"
  onEnter={async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/pts/by/kiinteistotunnus/${card?.kiinteistotunnus}`);
      const data = await res.json();
      setHasPTSData(data.length > 0);
    } catch (err) {
      console.error("Virhe haettaessa PTS-dataa:", err);
      setHasPTSData(false);
    }
  }}
>
  <div className="p-3">
    {hasPTSData === null ? (
      <p className="text-muted">Tarkistetaan PTS-tietoja...</p>
    ) : hasPTSData === true ? (
      <>
        <h5 className="mb-3 fw-bold text-success">📋 PTS-suunnitelma </h5>
        <PTSLongTermTable kiinteistotunnus={card?.kiinteistotunnus} />
        <div className="mt-3 text-end">
        
        </div>
      </>
    ) : (
      <>
        <p>Ei vielä PTS-suunnitelmaa tälle kiinteistölle.</p>
        <button className="btn btn-success" onClick={() => setShowPTSModal(true)}
        >
          ➕ Luo PTS
        </button>
      </>
    )}

    <Modal
      show={showPTSModal}
      onHide={() => setShowPTSModal(false)}
      size="xl"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{hasPTSData ? 'Muokkaa PTS-raporttia' : 'Luo uusi PTS'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PropertyDetailsForm
          rakennus={rakennus}
          kiinteistotunnus={card.kiinteistotunnus}
          rakennusData={card}
          initialTab="pts"
        />
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