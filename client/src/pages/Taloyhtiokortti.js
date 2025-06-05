import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Tab, Tabs } from 'react-bootstrap';
import StickyAfterScroll from '../components/Stickyafterscroll';
import { getKiinteistoWhole } from '../api/api';

function Taloyhtiokortti() {
    const { id } = useParams();
    const [card, setCard] = useState(null);
  
    useEffect(() => {

        getKiinteistoWhole(id)
            .then(res => {
                setCard(res.data);
                console.log(res.data)
                console.log("SIJAINTI" , card?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates)
                // console.log("SIJAINTI" , card.rakennukset[0].rakennustiedot.sijainti.coordinates)
            })
            .catch(err => console.error('Api error', err))

        }, [id]);
    
    if (!card) return <div>Loading...</div>;

  return (
    <>
        <h1 className="otsikko text-primary mb-1 mx-auto">
            Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h1>
        <div className="container mt-3 border border-primary">

            <div className='row border border-secondary'>
                <div className="col-md-6 border border-primary">            
                <h1>{card.kiinteistotunnus}</h1> 
                <p>{card?.rakennukset[0]?.osoite}</p>
                {/* <StickyAfterScroll></StickyAfterScroll> */}
            </div>
                <div className="col-md-6 border border-primary"><MapVisual pos={[65.00816937, 25.46030678]} coords={[card?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates[1],card?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates[0]]}/></div>
            </div>

            <div className='row border border-danger mt-3'>
                <Tabs
                    defaultActiveKey="dokumentit"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="dokumentit" title="Dokumentit ja raportit">
                        Tab content for Dokumentit ja raportit
                    </Tab>
                    <Tab eventKey="perustiedot" title="Perustiedot">
                        Tab content for Perustiedot
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

