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
  const [searchType, setSearchType] = useState('kiinteistötunnuksella') // kiinteistötunnuksella, rakennustunnuksella, osoitteella 

  const [rawResults, setRawResults] = useState([]);
  const [results, setResults] = useState([]);  
  const [loading, setLoading] = useState(false); //todo snipper when loading
  const [error, setError] = useState(null);

  const kiinteistotunnusHakuUrl = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:3067&CQL_FILTER=property_identifier='
  const rakennusKoordinaateillaHakuUrl = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:3067&CQL_FILTER=INTERSECTS(location_geometry_data'

  const rakennustunnusHakuUrl = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:3067&CQL_FILTER=permanent_building_identifier='
  const osoiteHakuUrl = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&SRSNAME=EPSG:3067&CQL_FILTER=address_fin='

  const rakennusBuildingkeyHakuUrl = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:3067&CQL_FILTER=building_key='
  const osoiteBuildingkeyHakuUrl = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&CQL_FILTER=building_key='


  const navigate = useNavigate();
  const location = useLocation();

  

  const handleSearch = async () => {
    setLoading(true); 
    console.log("Searching for:", searchQuery);
  
    try {
      let response;
      let responseAddress;
  
      if (searchType === 'kiinteistötunnuksella') {
        response = await axios.get(`${kiinteistotunnusHakuUrl}${searchQuery}`);
      } else if (searchType === 'rakennustunnuksella') {
        response = await axios.get(`${rakennustunnusHakuUrl}${searchQuery}`);
      } else if (searchType === 'osoitteella'){
        response = await axios.get(`${osoiteHakuUrl}'${searchQuery}'`);
      }

  
      setRawResults(response.data);
    } catch (err) {
      setError("An error occurred during the search.");
    } finally {
      setLoading(false);
    }
  };


  const getAddressInfo = async (feature) => {
    setLoading(true);
    try {
      // Extract only the UUID part of the ID
      const idKey = feature.id.split(".")[1];
    
      const response = await axios.get(`${osoiteBuildingkeyHakuUrl}'${idKey}'`);
  
      // Return the whole first feature (with full .properties etc.)
      return response.data.features[0] || {};
  
    } catch (err) {
      setError("An error occurred during the address fetch.");
      return {}; // Return empty object if error
    } finally {
      setLoading(false);
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

    // if (queryQuery && queryType) { <----- autom. haku
    //   handleSearch();
    // }
  }, [location.search]);  // Runs on URL change (including search params)



  useEffect(() => {
    const fetchData = async () => {
      if (rawResults?.features?.length > 0) {
        const data = buildrakennusData(rawResults.features);
  
        const transformedData = await Promise.all(
          data.map(async (feature) => {
            const addressResponse = await getAddressInfo(feature);
  
            feature.properties.yleistiedot["Kohteen osoite"] = addressResponse.properties['address_fin'];
            feature.properties.yleistiedot["Postinumero"] = addressResponse.properties['postal_code'];
            feature.properties.yleistiedot["Toimipaikka"] = addressResponse.properties['postal_office_fin'];
  
            return feature;
          })
        );
  
        setResults(transformedData);
        console.log("Transformed data - uef[rawResults]", transformedData);
      } else {
        setResults([]);
      }
    };
  
    fetchData(); // Call the async function
  }, [rawResults]);

  // searchAddressCoordinates(feature.geometry.coordinates[0], feature.geometry.coordinates[1]).address_fin 

  const buildrakennusData = (buildingFeature, addressFeature ) => {
      const transformedData =({
        type: "Feature",
        id: buildingFeature.id || null,
        geometry: {
            type: "Point",
            coordinates: buildingFeature.geometry.coordinates
        },
        properties: {
            yleistiedot: {
                "Rakennustunnus": buildingFeature.properties.permanent_building_identifier || null,
                "Kiinteistötunnus": buildingFeature.properties.property_identifier || null,
                "Kohteen nimi": null,
                "Kohteen osoite": addressFeature.properties.address_fin || null, 
                "Postinumero" : addressFeature.properties.postal_code || null, 
                "Toimipaikka": addressFeature.properties.postal_office_fin || null, 
            },
            teknisettiedot: {
                "Rakennusvuosi": buildingFeature.properties.completion_date ? buildingFeature.properties.completion_date.split("-")[0] : null,
                "Kokonaisala (m²)": buildingFeature.properties.total_area || null,
                "Kerrosala (m²)": buildingFeature.properties.gross_floor_area || null,
                "Huoneistoala (m²)": buildingFeature.properties.floor_area || null,
                "Tilavuus (m³)": buildingFeature.properties.volume || null,
                "Kerroksia": buildingFeature.properties.number_of_storeys || null,
            },
            rakennustiedot: {
                "Rakennusluokitus": buildingFeature.properties.main_purpose || null,
                "Runkotapa": buildingFeature.properties.construction_method || null,
                "Käytössäolotilanne": buildingFeature.properties.usage_status || null,
                "Julkisivun rakennusaine": buildingFeature.properties.facade_material || null,
                "Lämmitystapa": buildingFeature.properties.heating_method || null,
                "Lämmitysenergianlähde": buildingFeature.properties.heating_energy_source || null,
                "Kantavanrakenteen rakennusaine": buildingFeature.properties.material_of_load_bearing_structures || null,
            },
            aluetiedot: {
                "Tulvariski": null, 
                "Pohjavesialueella": null,
                "radon arvo": null
            }
        }
    })
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