import { useEffect, useRef, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Card, CardHeader, Col, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { getKiinteistoWhole } from '../api/api';
import PerustiedotAccordion from '../components/PerustiedotAccordion';
import { Button, Modal } from 'react-bootstrap';
import PropertyDetailsForm from '../components/ReportTemplate'; 
import TilastoTable from '../components/TilastoTable';
import TulosteetTab from '../components/TulosteetTab';
import MMLTabFetcher from '../components/MMLTabFetcher';
import PerustiedotTab from '../components/PerustiedotTab';
import MapVisualMultiple from '../components/MapVisualMultiple';


function Taloyhtiokortti() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const hasFetched = useRef(false);
  const [showPTSModal, setShowPTSModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [mapCoords, setMapCoords] = useState([]);
  const [activeTab, setActiveTab] = useState('perustiedot');
  const [existingPTSData, setExistingPTSData] = useState(null);
  const [activeKey, setActiveKey] = useState('perustiedot');


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

  }, [id]);


  useEffect(() => {
      if (card) {
        console.log('Card loaded:', card);
      }
    }, [card]);

  if (!card) return <div className="text-center mt-5">Ladataan tietoja...</div>;

  const rakennus = card.rakennukset_fulls[0];

    return (
      <div className="main-content">
        <div className="bg-success text-white d-flex align-items-center justify-content-center shadow-sm" style={{ minHeight: '20vh' }}>
          <header className="text-center">
            <h1 className="fw-bold display-5 mb-1 p-2">
              {rakennus?.osoite} <small className="fw-light">{rakennus?.toimipaikka}</small>
            </h1>
            <p className="fs-5 fw-light">Kiinteistön tiedot</p>

            <div className="d-flex justify-content-center mt-1 mb-1">
              <Tabs
                activeKey={activeKey}
                onSelect={(k) => setActiveKey(k)}
                id="taloyhtiokortti-tabs"
                className="mb-0 custom-tabs"
                variant="pills"
              >
                <Tab eventKey="perustiedot" title={<span className="text-white">Perustiedot</span>} />
                <Tab eventKey="dokumentit" title={<span className="text-white">Dokumentit</span>} />
                <Tab eventKey="pts" title={<span className="text-white">PTS</span>} />
                <Tab eventKey="kartta" title={<span className="text-white">Kartta</span>} />
              </Tabs>
            </div>
          </header>



        </div>


      {/* Tab content */}
      <div className="mt-1">
          {activeKey === 'perustiedot' && (
              <PerustiedotTab card={card}></PerustiedotTab>
          )}

        {activeKey === 'dokumentit' && <div>Dokumentit ja raportit sisältö tässä.</div>}
        {activeKey === 'pts' && <div>PTS sisältö tässä.</div>}
        {activeKey === 'kartta' && (
            <div
              className="bg-white shadow-sm p-1"
              style={{
                // border: '6px solid #04aa00',  // Bootstrap success green (#198754)
                maxWidth: '100%',
                boxShadow: '0 4px 8px rgba(25, 135, 84, 0.2)', // subtle greenish shadow
              }}
            >
              <MapVisualMultiple rakennukset_fulls={card.rakennukset_fulls} coords={mapCoords} height="75vh" />
            </div>
        )}
      </div>
      </div>
    );
}

export default Taloyhtiokortti;