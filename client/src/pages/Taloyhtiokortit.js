import { Button, Card } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import { getKiinteistot, getKiinteistotWithData } from '../api/api'; 
import { useEffect, useState } from 'react';

function Taloyhtiokortit() {


  const [kiinteistot, setKiinteistot] = useState()
  const [resultOrder, setResultOrder] = useState('DESC')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    getKiinteistotWithData(resultOrder, page)
      .then(res => {
        setKiinteistot(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);

      })
      .catch(err => console.error('Api error', err))

  }, [resultOrder, page]);

  const increasePage = () =>{
    if (page < totalPages){
      setPage(page+1)
    }
  }

  const decreasePage = () =>{
    if (page > 1){
       setPage(page-1)
    }
  }

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

          <select
            className="mx-auto mb-3 form-select w-50"
            aria-label="Filter"
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'latest') setResultOrder('DESC');
              else if (value === 'oldest') setResultOrder('ASC');
            }}
          >
            <option value="latest">Uusimmat</option>
            <option value="oldest">Vanhimmat</option>
          </select>


          <nav aria-label="Page navigation example" className="d-flex justify-content-center">
            <ul class="pagination">
              <li class="page-item" onClick={decreasePage}><a class="page-link" href="#">Edellinen</a></li>
              <li class="page-item disabled"><a class="page-link" href="#">{page}</a></li>
              <li class="page-item" onClick={increasePage}><a class="page-link" href="#">Seuraava</a></li>
            </ul>
          </nav>

           <div className="d-flex justify-content-center">Kortteja: {totalItems} Sivuja: {totalPages}</div>


          <div className=''>
              {kiinteistot?.map(kiinteisto => (
                <Card key={kiinteisto.id_kiinteisto} className="mt-3">
                  <Card.Header>{kiinteisto.osoite} | {kiinteisto.toimipaikka} {kiinteisto.postinumero}</Card.Header>
                  <Card.Body>
                    <Card.Title>{kiinteisto.kiinteistotunnus}</Card.Title>
                    <Card.Text>
                      
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

