import { Button, Card } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import { getKiinteistot } from '../api/api'; 
import { useEffect, useState } from 'react';

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

  const [kiinteistot, setKiinteistot] = useState()

  useEffect(() => {
    getKiinteistot()
      .then(res => setKiinteistot(res.data.items))
      .catch(err => console.error('Api error', err))

  }, []);

  return (
    <>
        <h1 className="otsikko text-primary mb-1 mx-auto">
            Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h1>
        <div className="container mt-3">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Kiinteistötunnus, osoite tai paikkakunta"
              aria-label="Search"
              aria-describedby="button-addon2"
            />


          </div>

          <nav aria-label="Page navigation example" className="d-flex justify-content-center">
            <ul class="pagination">
              <li class="page-item"><a class="page-link" href="#">Edellinen</a></li>
              <li class="page-item disabled"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">Seuraava</a></li>
            </ul>
          </nav>

            <select className="mx-auto mb-3 form-select w-50" aria-label="Filter">
              <option value="latest">Uusimmat</option>
              <option value="oldest">Vanhimmat</option>
              <option value="alphabetical">Aakkosjärjestys</option>
            </select>


          <div className=''>
              {kiinteistot?.map(kiinteisto => (
                <Card key={kiinteisto.id_kiinteisto} className="mt-3">
                  <Card.Header>{kiinteisto.kiinteistotunnus}</Card.Header>
                  <Card.Body>
                    <Card.Title>Kiinteistö...</Card.Title>
                    <Card.Text>
                      Tämä on taloyhtiökortti...
                    </Card.Text>
                    
                    <Link key={kiinteisto.id_kiinteisto} to={`/taloyhtiokortti/${kiinteisto.id_kiinteisto}`}>
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

