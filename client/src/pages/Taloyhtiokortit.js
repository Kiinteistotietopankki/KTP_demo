import { Button, Card } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import { getKiinteistot } from '../api/api'; 
import { useEffect, useState } from 'react';

function Taloyhtiokortit() {


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

