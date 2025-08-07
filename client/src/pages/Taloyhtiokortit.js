import { Button, Card, Form, InputGroup, Modal, Badge, Dropdown } from 'react-bootstrap';
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
            <header className="w-100 px-3 mt-3 text-center">
              <h1 className="fw-bold fs-4 display-5 mb-3">
                Hae taloyhtiökortteja
              </h1>

              <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <InputGroup className="mb-3 shadow-sm rounded w-100">
                  <Form.Control
                    type="text"
                    placeholder="Kiinteistötunnus, osoite tai paikkakunta"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-primary flex-grow-1 text-center"
                  />
                  <Button variant="success" onClick={handleSearch}>
                    Hae
                  </Button>
                </InputGroup>

                <Dropdown drop="down" className='mb-3'>
                  <Dropdown.Toggle variant="light" size="sm">
                    {resultOrder === 'DESC' ? 'Uusimmat' : 'Vanhimmat'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    className="mx-auto text-center border"
                    // style={{ padding: '0'}}
                  >
                    <Dropdown.Item
                      className="py-1 px-2 border-bottom"
                      onClick={() => setResultOrder('DESC')}
                    >
                      Uusimmat
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="py-1 px-2"
                      onClick={() => setResultOrder('ASC')}
                    >
                      Vanhimmat
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </header>
          </div>


        <div className='container'>

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
              <div key={kiinteisto.id_kiinteisto} className="col-md-6 col-lg-4 mb-1">
                <Card className="h-100 border-0 rounded-4 card-hover" style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)', opacity:'0.8+'}}>
                  <Card.Header className="bg-primary text-white text-center px-3 py-2">
                    <div className="d-flex flex-column">
                      <div className="fw-semibold fs-6 text-truncate">
                        {kiinteisto.rakennukset_fulls[0]?.osoite}
                      </div>
                      <div className="small text-truncate opacity-75">
                        {kiinteisto.rakennukset_fulls[0]?.postinumero} {kiinteisto.rakennukset_fulls[0]?.toimipaikka}
                      </div>
                    </div>
                  </Card.Header>

                  <Card.Body className="d-flex flex-column justify-content-between p-3 text-center">
                    <div className="mb-2 text-muted small">
                      Kiinteistötunnus: <span className="text-dark">{kiinteisto.kiinteistotunnus}</span>
                    </div>

                    <Link to={`/taloyhtiokortti/${kiinteisto.id_kiinteisto}`} className="mt-auto">
                      <Button variant="success" className="w-100 fw-semibold rounded-pill">
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
