import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Tab, Tabs } from 'react-bootstrap';
import StickyAfterScroll from '../components/Stickyafterscroll';

function Taloyhtiokortti() {
    const { id } = useParams();
    const [card, setCard] = useState(null);
  
    useEffect(() => {
      // Simulate an API call with mock data
    const mockData = {
        1: { title: 'Card One', description: 'Details about Card One' },
        2: { title: 'Card Two', description: 'Details about Card Two' },
        3: { title: 'Card Three', description: 'Details about Card Three' },
        4: { title: 'Card Four', description: 'Details about Card Four' },
        5: { title: 'Card Five', description: 'Details about Card Five' },
        6: { title: 'Card Six', description: 'Details about Card Six' },
        7: { title: 'Card Seven', description: 'Details about Card Seven' },
        8: { title: 'Card Eight', description: 'Details about Card Eight' },
        9: { title: 'Card Nine', description: 'Details about Card Nine' },
        10: { title: 'Card Ten', description: 'Details about Card Ten' },
        11: { title: 'Card Eleven', description: 'Details about Card Eleven' },
        12: { title: 'Card Twelve', description: 'Details about Card Twelve' },
        13: { title: 'Card Thirteen', description: 'Details about Card Thirteen' },
        14: { title: 'Card Fourteen', description: 'Details about Card Fourteen' },
        15: { title: 'Card Fifteen', description: 'Details about Card Fifteen' },
        16: { title: 'Card Sixteen', description: 'Details about Card Sixteen' },
        17: { title: 'Card Seventeen', description: 'Details about Card Seventeen' },
        18: { title: 'Card Eighteen', description: 'Details about Card Eighteen' },
        19: { title: 'Card Nineteen', description: 'Details about Card Nineteen' },
        20: { title: 'Card Twenty', description: 'Details about Card Twenty' }
    };

      setCard(mockData[id]);
    }, [id]);
  
    if (!card) return <div>Loading...</div>;

  return (
    <>
        <h1 className="otsikko text-primary mb-1 mx-auto">
            Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h1>
        <div className="container mt-3 border border-primary">

            <div className='row border border-secondary'>
                <div class="col-md-6 border border-primary">            
                <h1>{card.title}</h1> 
                <p>{card.description}</p>
                {/* <StickyAfterScroll></StickyAfterScroll> */}
            </div>
                <div class="col-md-6 border border-primary"><MapVisual pos={[65.00816937, 25.46030678]} coords={[65.00816937, 25.46030678]}/></div>
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

