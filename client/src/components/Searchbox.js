// Searchbox.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import '../App.css';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

// Hakulogiikka on tässä

function Searchbox({ afterSearch }) {

  const [searchQuery, setSearchQuery] = useState("");
  const [rawResults, setRawResults] = useState([]);
  const [results, setResults] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [searchType, setSearchType] = useState('kiinteistötunnuksella') // kiinteistotunnus, rakennustunnus, osoite 

  const handleSearch = async () => {
    setLoading(true); // Add this to show loading state
    console.log("Searching for:", searchQuery);
  
    try {
      const response = await axios.get(`https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&CQL_FILTER=property_identifier='${searchQuery}'&SRSNAME=EPSG:3067`);
      setRawResults(response.data);
      console.log("async handlesearch", response.data);
    } catch (err) {
      setError("An error occurred during the search.");
    } finally {
      setLoading(false); // Reset loading after fetching data
    }
  };

  

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Parse the query string from the URL

    const queryQuery = queryParams.get('searchQuery');  // Extract 'searchQuery' from the URL
    const queryType = queryParams.get('searchType');    // Extract 'searchType' from the URL

    if (queryQuery) {
      setSearchQuery(queryQuery);  // Set state for searchQuery
    }
    if (queryType) {
      setSearchType(queryType);    // Set state for searchType
    }

    // Optionally, trigger the search when the page loads
    if (queryQuery && queryType) {
      handleSearch();
    }
  }, [location.search]);  // Runs on URL change (including search params)

  useEffect(() => {
    if (rawResults?.features?.length > 0) {
        const transformedData = buildrakennusData(rawResults.features)

        setResults(transformedData);
        console.log("Transformed data - uef[rawResults]",transformedData)

    }
  }, [rawResults]);

  const buildrakennusData = (features) => {
      const transformedData = features.map(feature => ({
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: feature.geometry.coordinates
        },
        properties: {
            yleistiedot: {
                "Rakennustunnus": feature.properties.permanent_building_identifier || null,
                "Kiinteistötunnus": feature.properties.property_identifier || null,
                "Kohteen nimi": null,
                "Kohteen osoite": null, 
                "Postinumero" : null, 
                "Toimipaikka": null,
            },
            teknisettiedot: {
                "Rakennusvuosi": feature.properties.completion_date ? feature.properties.completion_date.split("-")[0] : null,
                "Kokonaisala (m²)": feature.properties.total_area || null,
                "Kerrosala (m²)": feature.properties.gross_floor_area || null,
                "Huoneistoala (m²)": feature.properties.floor_area || null,
                "Tilavuus (m³)": feature.properties.volume || null,
                "Kerroksia": feature.properties.number_of_storeys || null,
            },
            rakennustiedot: {
                "Rakennusluokitus": feature.properties.main_purpose || null,
                "Runkotapa": feature.properties.construction_method || null,
                "Käytössäolotilanne": feature.properties.usage_status || null,
                "Julkisivun rakennusaine": feature.properties.facade_material || null,
                "Lämmitystapa": feature.properties.heating_method || null,
                "Lämmitysenergianlähde": feature.properties.heating_energy_source || null,
                "Kantavanrakenteen rakennusaine": feature.properties.material_of_load_bearing_structures || null,
            },
            aluetiedot: {
                "Tulvariski": null, 
                "Pohjavesialueella": null
            }
        }
    }));
    return transformedData;
  };

  useEffect(() => {
    afterSearch(results)

  }, [results, afterSearch]);

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
      

      <div className="mt-4">
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
          <button
            className="btn btn-outline-secondary"
            onClick={handleSearch}
            id="button-addon2"
          >
            Hae
          </button>
        </div>
      </div>


    
        <div className='featureAmount-container'>
          {rawResults?.features?.length > 0 ? (
              <span className="badge bg-success">
                Tuloksia: {rawResults.totalFeatures}
              </span>
            ) : (
              <span className="badge bg-secondary">Ei tuloksia</span>
            )}
        </div>
      </div>
  );
}

export default Searchbox;