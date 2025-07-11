import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import { getKiinteistotWithRakennukset } from '../api/api'; // your updated api function
import { useEffect, useState } from 'react';

function Taloyhtiokortit() {
  const [kiinteistot, setKiinteistot] = useState([]);
  const [resultOrder, setResultOrder] = useState('DESC'); // default ASC matches your API default
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [errMessage, setErrMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true); // start loading
      setErrMessage('');

      const response = await getKiinteistotWithRakennukset(
        page,
        pageSize,
        'id_kiinteisto',
        resultOrder,
        searchTerm
      );

      const { data, totalPages, totalItems } = response.data;
      setKiinteistot(data);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
    } catch (error) {
      setErrMessage(error.message || 'Error fetching data');
    } finally {
      setLoading(false); // stop loading
    }
  };


  useEffect(() => {
    fetchData();
  }, [page, pageSize, resultOrder]); 


  const increasePage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const decreasePage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleSearch = () => {
    setPage(1);
    fetchData(); // Trigger search
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <div className="container mt-4">
        <InputGroup className="mb-3 shadow-sm rounded">
          <Form.Control
            type="text"
            placeholder="Kiinteistötunnus, osoite tai paikkakunta"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-primary"
          />
          <Button variant="primary" onClick={handleSearch}>
            Hae
          </Button>
        </InputGroup>

        <Form.Select
          className="w-50 mx-auto mb-3 shadow-sm"
          aria-label="Filter"
          value={resultOrder === 'DESC' ? 'latest' : 'oldest'}
          onChange={(e) => {
            setResultOrder(e.target.value === 'latest' ? 'DESC' : 'ASC');
          }}
        >
          <option value="latest">Uusimmat</option>
          <option value="oldest">Vanhimmat</option>
        </Form.Select>

        <nav aria-label="Page navigation" className="d-flex justify-content-center mb-2">
          <ul className="pagination shadow-sm rounded">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={decreasePage}>
                Edellinen
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">{page}</span>
            </li>
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={increasePage}>
                Seuraava
              </button>
            </li>
          </ul>
        </nav>

        <div className="text-center mb-3 fw-semibold">
          Kortteja: {totalItems} | Sivuja: {totalPages}
        </div>

        {errMessage && (
          <div className="text-center mb-3">
            <Badge bg="danger" pill>
              {errMessage}
            </Badge>
          </div>
        )}

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Ladataan...</span>
            </div>
          </div>
        )}

        <div className="row g-4">
          {kiinteistot?.map((kiinteisto) => (
            <div key={kiinteisto.id_kiinteisto} className="col-md-6 col-lg-4">
              <Card className="h-100 shadow-sm border-primary hover-shadow transition">
                <Card.Header className="bg-primary text-white fw-bold fs-5">
                  {kiinteisto.rakennukset_fulls[0]?.osoite} | {kiinteisto.rakennukset_fulls[0]?.toimipaikka} {kiinteisto.rakennukset_fulls[0]?.postinumero}
                </Card.Header>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className="fs-6 text-secondary">
                    Kiinteistötunnus: {kiinteisto.kiinteistotunnus}
                  </Card.Title>
                  <Link to={`/taloyhtiokortti/${kiinteisto.id_kiinteisto}`} className="mt-3">
                    <Button variant="outline-primary" className="w-100 fw-semibold">
                      Avaa kortti
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 123, 255, 0.3);
          transform: translateY(-3px);
          transition: 0.3s ease;
        }
        .transition {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
      `}</style>
    </>
  );
}

export default Taloyhtiokortit;