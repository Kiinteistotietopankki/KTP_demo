import { Button, Card, Form, InputGroup, Modal, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getKiinteistotWithRakennukset } from '../api/api';
import { useEffect, useState } from 'react';
import PropertyDetailsForm from '../components/ReportTemplate'; 

function Taloyhtiokortit() {
  const [kiinteistot, setKiinteistot] = useState([]);
  const [resultOrder, setResultOrder] = useState('DESC'); // default DESC matches your API default
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [errMessage, setErrMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRakennusForReport, setSelectedRakennusForReport] = useState(null);

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
      // Check if error.response exists (Axios error)
      if (error.response) {
        switch (error.response.status) {
          case 403:
            setErrMessage('Käyttäjä ei ole kirjautunut sisään tai oikeudet puuttuvat (403)');
            break;
          case 401:
            setErrMessage('Autentikointi epäonnistui (401)');
            break;
          case 500:
            setErrMessage('Palvelinvirhe (500)');
            break;
          default:
            setErrMessage(`Virhe haussa: ${error.response.status}`);
        }
      } else if (error.message) {
        setErrMessage(error.message);
      } else {
        setErrMessage('Tuntematon virhe haussa');
      }
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
    fetchData();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
      <div className="main-content">
          <div className="bg-success text-white d-flex align-items-center justify-content-center shadow-sm" style={{ minHeight: '20vh' }}>
            <header className="text-center">
              <h1 className="fw-bold fs-4 display-5 mb-1 p-2">
              Hae taloyhtiökortteja {/* <small className="fw-light">Taloyhtiökortit</small> */}
              </h1>
              {/* <p className="fs-5 fw-light">Hae taloyhtiökortteja</p> */}


<InputGroup className="mb-3 shadow-sm rounded w-100">
  <Form.Control
    type="text"
    placeholder="Kiinteistötunnus, osoite tai paikkakunta"
    aria-label="Search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={handleKeyDown}
    className="border-primary flex-grow-1"
  />
  <Button variant="success" onClick={handleSearch}>
    Hae
  </Button>
</InputGroup>
              
              <Form.Select
                  className="w-70 mx-auto mb-3 shadow-sm"
                  aria-label="Filter"
                  value={resultOrder === 'DESC' ? 'latest' : 'oldest'}
                  onChange={(e) => {
                  setResultOrder(e.target.value === 'latest' ? 'DESC' : 'ASC');
                  }}
                >
                <option value="latest">Uusimmat</option>
                <option value="oldest">Vanhimmat</option>
              </Form.Select>

            </header>
          </div>


        <div className='container'>




          {/* <nav aria-label="Page navigation" className="d-flex justify-content-center mb-2">
            <ul className="pagination shadow-sm rounded">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link text-success" onClick={decreasePage}>
                  Edellinen
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">{page}</span>
              </li>
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link text-success" onClick={increasePage}>
                  Seuraava
                </button>
              </li>
            </ul>
          </nav> */}

          <div className="text-center my-3 fw-semibold">
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
                    


                    <Link to={`/taloyhtiokortti/${kiinteisto.id_kiinteisto}`} className="mt-2">
                      <Button variant="outline-success" className="w-100 fw-semibold">
                        Avaa kortti
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>


          <nav aria-label="Page navigation" className="d-flex justify-content-center my-3">
            <ul className="pagination shadow-sm rounded">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link text-success" onClick={decreasePage}>
                  Edellinen
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">{page}</span>
              </li>
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link text-success" onClick={increasePage}>
                  Seuraava
                </button>
              </li>
            </ul>
          </nav>
        </div>

      </div>

  );
}

export default Taloyhtiokortit;
