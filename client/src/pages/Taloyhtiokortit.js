import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';

function Taloyhtiokortit() {
  const cards = [
    { id: 1, title: 'Card One' },
    { id: 2, title: 'Card Two' }
  ]; // You'd fetch this from an API

  return (
    <>
        <h1 className="otsikko text-primary mb-1 mx-auto">
            Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h1>
        <div className="container mt-3">
        <div>
            {cards.map(card => (
              <Link key={card.id} to={`/taloyhtiokortti/${card.id}`}>
                <div>{card.title}</div>
              </Link>
            ))}
        </div>
        </div>
    </>
  );
}

export default Taloyhtiokortit;

