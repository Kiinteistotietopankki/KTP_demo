import { useEffect, useRef, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Tab, Tabs } from 'react-bootstrap';
import StickyAfterScroll from '../components/Stickyafterscroll';
import { getKiinteistoWhole } from '../api/api';
import PerustiedotAccordion from '../components/PerustiedotAccordion';

function Taloyhtiokortti() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const hasFetched = useRef(false);

  const [mapCoords, setMapCoords] = useState([]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    getKiinteistoWhole(id)
      .then(res => {
        setCard(res.data);
        const coords = res.data?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates;
        if (coords) setMapCoords([coords[1], coords[0]]);
      })
      .catch(err => console.error('API error:', err));
  }, [id]);

  if (!card) return <div className="text-center mt-5">Ladataan tietoja...</div>;

  const rakennus = card.rakennukset[0];

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
  );
}

export default Taloyhtiokortti;
