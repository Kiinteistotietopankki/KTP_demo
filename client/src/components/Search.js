// Searchbox.js
import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import KiinteistoHaku from '../classes/Kiinteistohaku';

// Hakulogiikka on tässä

function Search({afterSearch}) {

  const [searchQuery, setSearchQuery] = useState("");
  const [postalOffice, setPostalOffice] = useState("")
  const [searchType, setSearchType] = useState('kiinteistötunnuksella') // kiinteistötunnuksella, rakennustunnuksella, osoitteella

  const [kiinteistoCount, setKiinteistoCount] = useState()


  const navigate = useNavigate();
  const location = useLocation();

  const KH = useRef(new KiinteistoHaku()).current;
  

  const handleSearch = async () => {
    let response = []
    console.log("Searching for:", searchQuery, postalOffice);
  
    try {
      let trimmedQuery = searchQuery.trim() 
  
      if (searchType === 'kiinteistötunnuksella') {
        response = await KH.haeKiinteistoTunnuksella(trimmedQuery)
        setResponseCount(response)
        afterSearch(response)

      } else if (searchType === 'rakennustunnuksella') {


      } else if (searchType === 'osoitteella'){

        let trimmedKunta = postalOffice.trim() 
        response = await KH.haeKiinteistotOsoitteella(trimmedQuery, trimmedKunta);
        setResponseCount(response)
        afterSearch(response)
          
      }
    } catch (err) {

    } finally {
    }
  };

  const setResponseCount = (response) =>{
    setKiinteistoCount(response.length)
  }


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Parse the query string from the URL

    const queryQuery = queryParams.get('searchQuery');  // Extract 'searchQuery' from the URL
    const queryType = queryParams.get('searchType');    // Extract 'searchType' from the URL

    if (queryQuery) {
      setSearchQuery(queryQuery);  
    }
    if (queryType) {
      setSearchType(queryType);  
    }

  }, [location.search]); 




  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key
    }
  };

  useEffect(() => {
    navigate(`?searchQuery=${searchQuery}&searchType=${searchType}`);
  }, [searchType, searchQuery]);

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
            {/* <Tab eventKey="otsikko" title="Hakutyyppi" disabled>

            </Tab> */}

            <Tab eventKey="kiinteistötunnuksella" title="Kiinteistötunnus">

            </Tab>

            <Tab eventKey="rakennustunnuksella" title="Rakennustunnus">

            </Tab>

            <Tab eventKey="osoitteella" title="Osoite">

            </Tab>

        </Tabs>
        

        <div className="mt-4 d-flex flex-column mb-3">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={`Hae ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search"
              aria-describedby="button-addon2"
            />

          </div>

          {searchType==='osoitteella' ? (
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder={`Kunta tai kaupunki`}
                value={postalOffice}
                onChange={(e) => setPostalOffice(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search"
                aria-describedby="button-addon2"
              />
            </div>
          ):(<></>)}

          <button
            className="btn btn-outline-secondary"
            onClick={handleSearch}
            id="button-addon2">
              Hae
          </button>

        </div>


      
          <div className='featureAmount-container'>
            {kiinteistoCount > 0 ? (
                <span className="badge bg-success">
                  Kiinteistöjä: {kiinteistoCount}
                </span>
              ) : (
                <span className="badge bg-secondary">Ei tuloksia</span>
              )}
          </div>
      </div>
  );
}

export default Search;