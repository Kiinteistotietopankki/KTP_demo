import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';

function Taloyhtiokortti() {
    const { id } = useParams();
    const [card, setCard] = useState(null);
  
    useEffect(() => {
      // Simulate an API call with mock data
      const mockData = {
        1: { title: 'Card One', description: 'Details about Card One' },
        2: { title: 'Card Two', description: 'Details about Card Two' },
      };
      setCard(mockData[id]);
    }, [id]);
  
    if (!card) return <div>Loading...</div>;

  return (
    <>
        <h1 className="otsikko text-primary mb-1 mx-auto">
            Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h1>
        <div className="container mt-3">
            <h1>{card.title}</h1>
            <p>{card.description}</p>
        </div>
    </>
  );
}

export default Taloyhtiokortti;

