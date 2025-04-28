// Searchbox.js
import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import KiinteistoHaku from '../classes/Kiinteistohaku';
import { ktKokomuotoon } from '../assets/ktMuuntaja';

// Hakulogiikka on tässä

function Search({afterSearch}) {

  const [kiinteistotunnus, setKiinteistotunnus] = useState("")
  const [osoite, setOsoite] = useState("")
  const [paikkakunta, setPaikkakunta] = useState("")

  const [searchType, setSearchType] = useState('kiinteistötunnuksella') // kiinteistötunnuksella, rakennustunnuksella, osoitteella

  const [kiinteistoCount, setKiinteistoCount] = useState()

  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();

  const KH = useRef(new KiinteistoHaku()).current;
  

  const handleSearch = async () => {
    let response = []

    setLoading(true)
  
    try {
      let trimmedKt = kiinteistotunnus.trim()
      let ktKokomuoto = ktKokomuotoon(trimmedKt)
      let trimmedOsoite = osoite.trim() 
      let trimmedKunta = paikkakunta.trim() 

      response = await KH.haeKiinteistoja({kiinteistotunnus:ktKokomuoto, osoite:trimmedOsoite, kaupunki:trimmedKunta})
      setResponseCount(response)
      afterSearch(response)

    } catch (err) {

    } finally {
      setLoading(false)
    }
  };

  const setResponseCount = (response) =>{
    setKiinteistoCount(response.length)
  }


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Parse the query string from the URL

    const queryKiinteistotunnus = queryParams.get('kiinteistotunnus')
    const queryOsoite = queryParams.get('osoite')
    const queryPaikkakunta = queryParams.get('paikkakunta')

    if (queryKiinteistotunnus) {
      setKiinteistotunnus(queryKiinteistotunnus);  
    }
    if (queryOsoite) {
      setOsoite(queryOsoite);  
    }
    if (queryPaikkakunta){
      setPaikkakunta(queryPaikkakunta)
    }
  }, [location.search]); 




  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key
    }
  };

  useEffect(() => {
    navigate(`?kiinteistotunnus=${kiinteistotunnus}&osoite=${osoite}&paikkakunta=${paikkakunta}`);
  }, [kiinteistotunnus, osoite, paikkakunta]);

  const handleTabChange = (newSearchType) => {
    setSearchType(newSearchType);
  };

  return (
    <div className='search-container'>
        {/* Search Type Toggle Switch */}

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
              placeholder={`Kiinteistötunnus`}
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
            id="button-addon2">
              Hae
          </button>

        </div>


      
          <div className='featureAmount-container d-flex align-items-center'>

            {kiinteistoCount > 0 ? (
                <span className="badge bg-success">
                  Kiinteistöjä: {kiinteistoCount}
                </span>
              ) : (
                <span className="badge bg-secondary">Ei tuloksia</span>
              )}
              {loading ? (<div className="spinner-border ms-3" role="status"></div>):(<></>)}
            
         
          </div>
      </div>
  );
}

export default Search;