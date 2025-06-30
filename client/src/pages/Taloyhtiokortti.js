import { useEffect, useRef, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Tab, Tabs } from 'react-bootstrap';
import StickyAfterScroll from '../components/Stickyafterscroll';
import { getKiinteistoWhole } from '../api/api';

function Taloyhtiokortti() {
    const { id } = useParams();
    const [card, setCard] = useState(null);
  
    const hasFetched = useRef(false); //Ei api kutsua kahdesti jos haettu jo. Tuplapäivitys johtuu <StricMode> asetuksesta

    const [mapCoords, setMapCoords] = useState([])

    useEffect(() => {
        if (hasFetched.current) return;  // Skip if already fetched
        hasFetched.current = true;

        getKiinteistoWhole(id)
        .then(res => {
            setCard(res.data);
            console.log(res.data);
            setMapCoords([res.data?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates[1],res.data?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates[0]])
        })
        .catch(err => console.error('Api error', err));
    }, [id]);

    if (!card) return <div>Loading...</div>;

  return (
    <div className='container'>
        {/* <h1 className="otsikko text-primary mx-auto">
            Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h1> */}
        <div className="container mt-3 border border-primary">

            <div className='row border border-secondary'>
                <div className="col-md-6 border border-primary">            
                    <h2>{card?.rakennukset[0]?.osoite} {card?.rakennukset[0]?.toimipaikka}</h2>
                    <h4>{card.kiinteistotunnus}</h4> 
                    {/* {card?.rakennukset.map(rakennus => (
                    <p key={rakennus.id_rakennus}>
                        {rakennus.rakennustunnus}
                    </p>) )} */}
                    
                
                </div>
                <div className="col-md-6 border border-primary"><MapVisual pos={[65.00816937, 25.46030678]} coords={mapCoords}/></div>
            </div>

            <div className='row border border-danger mt-3'>
                <Tabs
                    defaultActiveKey="perustiedot"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
 
                    <Tab eventKey="perustiedot" title="Perustiedot">
{/* 
                            <div>
                                <pre className="mb-0">{JSON.stringify(card, null, 2)}</pre>
                            </div> */}
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
    </div>
  );
}

export default Taloyhtiokortti;

