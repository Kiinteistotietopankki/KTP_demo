// Searchbox.js
import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import { Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import KiinteistoHaku from '../classes/Kiinteistohaku';
import { ktKokomuotoon } from '../assets/ktMuuntaja';
import { searchKiinteistot } from '../api/api';

function Search({ afterSearch }) {
  const [kiinteistotunnus, setKiinteistotunnus] = useState("");
  const [osoite, setOsoite] = useState("");
  const [paikkakunta, setPaikkakunta] = useState("");
  const [searchType, setSearchType] = useState('kiinteistötunnuksella'); 
  const [kiinteistoCount, setKiinteistoCount] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const KH = useRef(new KiinteistoHaku()).current;

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      let trimmedKt = kiinteistotunnus.trim();
      let ktKokomuoto = ktKokomuotoon(trimmedKt);
      let trimmedOsoite = osoite.trim();
      let trimmedKunta = paikkakunta.trim();

      const response = await searchKiinteistot(ktKokomuoto, trimmedOsoite, trimmedKunta);
      const data = response.data;

      if (data?.error) {
        setError(data.error);
        setKiinteistoCount(0);
        afterSearch([]);
      } else {
        setError(null);
        setResponseCount(data);
        afterSearch(data);
      }
    } catch (err) {
      // Handle HTTP errors
      if (err.response) {
        // HTTP status available
        switch (err.response.status) {
          case 403:
            setError("Käyttäjä ei ole kirjautunut sisään tai oikeudet puuttuvat (403)");
            break;
          case 401:
            setError("Autentikointi epäonnistui (401)");
            break;
          case 500:
            setError("Palvelinvirhe (500)");
            break;
          default:
            setError(`Virhe haussa: ${err.response.status}`);
        }
      } else {
        // Network or other errors
        setError("Verkkovirhe tai palvelin ei vastaa");
      }
      setKiinteistoCount(0);
      afterSearch([]);
      console.error("Virhe haussa:", err);
    } finally {
      setLoading(false);
    }
  };

  const setResponseCount = (response) => {
    setKiinteistoCount(response[0]?.rakennukset?.length > 0 ? response.length : 0);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const queryKiinteistotunnus = queryParams.get('kiinteistotunnus');
    const queryOsoite = queryParams.get('osoite');
    const queryPaikkakunta = queryParams.get('paikkakunta');

    if (queryKiinteistotunnus) setKiinteistotunnus(queryKiinteistotunnus);
    if (queryOsoite) setOsoite(queryOsoite);
    if (queryPaikkakunta) setPaikkakunta(queryPaikkakunta);
  }, [location.search]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    navigate(`?kiinteistotunnus=${kiinteistotunnus}&osoite=${osoite}&paikkakunta=${paikkakunta}`);
  }, [kiinteistotunnus, osoite, paikkakunta, navigate]);

  const handleTabChange = (newSearchType) => {
    setSearchType(newSearchType);
  };

  return (
    <div className='search-container'>
      <Tabs
        id="controlled-tab-example"
        activeKey={searchType}
        onSelect={(k) => handleTabChange(k)}
        className="mb-3 d-flex justify-content-center"
      >
        <Tab eventKey="kiinteistötunnuksella" title="Kiinteistöhaku"></Tab>
      </Tabs>

      <div className="mt-4 d-flex flex-column mb-3">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Kiinteistötunnus (esitys- tai täysmuodossa)`}
            value={kiinteistotunnus}
            onChange={(e) => setKiinteistotunnus(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            aria-describedby="button-addon2"
          />
        </div>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Osoite`}
            value={osoite}
            onChange={(e) => setOsoite(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            aria-describedby="button-addon2"
          />
        </div>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Paikkakunta`}
            value={paikkakunta}
            onChange={(e) => setPaikkakunta(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            aria-describedby="button-addon2"
          />
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={handleSearch}
          id="button-addon2"
        >
          Hae
        </button>
      </div>

      {/* Show error message */}
      {error && (
        <div className="alert alert-danger" role="alert" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      <div className='featureAmount-container d-flex align-items-center'>
        {kiinteistoCount > 0 ? (
          <span className="badge bg-success">
            Kiinteistöjä: {kiinteistoCount}
          </span>
        ) : (
          !error && <span className="badge bg-secondary">Ei tuloksia</span>
        )}
        {loading && <div className="spinner-border ms-3" role="status"></div>}
      </div>
    </div>
  );
}

export default Search;
