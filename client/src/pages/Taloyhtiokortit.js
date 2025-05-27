import { Button, Card } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';

function Taloyhtiokortit() {
  const cards = [
    { id: 1, title: 'Card One' },
    { id: 2, title: 'Card Two' },
    { id: 3, title: 'Card Three' },
    { id: 4, title: 'Card Four' },
    { id: 5, title: 'Card Five' },
    { id: 6, title: 'Card Six' },
    { id: 7, title: 'Card Seven' },
    { id: 8, title: 'Card Eight' },
    { id: 9, title: 'Card Nine' },
    { id: 10, title: 'Card Ten' },
    { id: 11, title: 'Card Eleven' },
    { id: 12, title: 'Card Twelve' },
    { id: 13, title: 'Card Thirteen' },
    { id: 14, title: 'Card Fourteen' },
    { id: 15, title: 'Card Fifteen' },
    { id: 16, title: 'Card Sixteen' },
    { id: 17, title: 'Card Seventeen' },
    { id: 18, title: 'Card Eighteen' },
    { id: 19, title: 'Card Nineteen' },
    { id: 20, title: 'Card Twenty' }
  ];

  return (
    <>
        <h1 className="otsikko text-primary mb-1 mx-auto">
            Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h1>
        <div className="container mt-3">
          <div className="input-group mb-5">
            <input
              type="text"
              className="form-control"
              placeholder="Kiinteistötunnus tai osoite"
              aria-label="Search"
              aria-describedby="button-addon2"
            />

            <select className="form-select" aria-label="Filter">
              <option value="latest">Uusimmat</option>
              <option value="oldest">Vanhimmat</option>
              <option value="alphabetical">Aakkosjärjestys</option>
            </select>
          </div>
          <div>
              {cards.map(card => (
                <Card key={card.id} className="mt-3">
                  <Card.Header>{card.title}</Card.Header>
                  <Card.Body>
                    <Card.Title>Kiinteistö {card.id}</Card.Title>
                    <Card.Text>
                      Tämä on taloyhtiökortti {card.id}
                    </Card.Text>
                    
                    <Link key={card.id} to={`/taloyhtiokortti/${card.id}`}>
                      <Button variant="primary">Avaa kortti</Button>
                    </Link>
                  </Card.Body>
                </Card>
              ))}

          </div>
        </div>
    </>
  );
}

export default Taloyhtiokortit;

