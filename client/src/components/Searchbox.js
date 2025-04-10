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

  const rakennusBuildingkeyHakuUrl = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&SRSNAME=EPSG:3067&&featureID=open_building.'
  const osoiteBuildingkeyHakuUrl = 'https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json&typeName=ryhti_building:open_address&CQL_FILTER=building_key='


  const navigate = useNavigate();
  const location = useLocation();

  

  const handleSearch = async () => {
    setLoading(true); 
    console.log("Searching for:", searchQuery);
  
    try {
      let response;
      let query = searchQuery.trim();
  
      if (searchType === 'kiinteistötunnuksella') {
        response = await axios.get(`${kiinteistotunnusHakuUrl}${query}`);
      } else if (searchType === 'rakennustunnuksella') {
        response = await axios.get(`${rakennustunnusHakuUrl}'${query}'`);
        // console.log('Rakennustunnus haku:',`${rakennustunnusHakuUrl}${query}`)

      } else if (searchType === 'osoitteella'){
        if (query.length > 0) {
          query = query.charAt(0).toUpperCase() + query.slice(1);
        }

        response = await axios.get(`${osoiteHakuUrl}'${query}'`);

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

  const getBuildingInfo = async (feature) => {
    setLoading(true);
    try {
      // Extract only the UUID part of the ID
      const idKey = feature.id;

      console.log('getBuildinginfo 1', feature.id)
    
      const response = await axios.get(`${rakennusBuildingkeyHakuUrl}${idKey}`);

      console.log('getBuildingInfoQuery: ',`${rakennusBuildingkeyHakuUrl}${idKey}`)

      console.log('getBuildingInfoData: ',response.data.features[0])
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

            if (searchType!=='osoitteella'){
              const addressResponse = await getAddressInfo(feature);  
              feature.properties.yleistiedot["Kohteen osoite"] = addressResponse.properties['address_fin'];
              feature.properties.yleistiedot["Postinumero"] = addressResponse.properties['postal_code'];
              feature.properties.yleistiedot["Toimipaikka"] = addressResponse.properties['postal_office_fin'];

            } else{
              const buildingResponse = await getBuildingInfo(feature);
              feature.properties.yleistiedot["Rakennustunnus"] = buildingResponse.properties['permanent_building_identifier'];
              feature.properties.yleistiedot["Kiinteistötunnus"] = buildingResponse.properties['property_identifier'];

              feature.properties.teknisettiedot["Rakennusvuosi"] = buildingResponse.properties['completion_date'];
              feature.properties.teknisettiedot["Kokonaisala (m²)"] = buildingResponse.properties['total_area'];
              feature.properties.teknisettiedot["Kerrosala (m²)"] = buildingResponse.properties['gross_floor_area'];
              feature.properties.teknisettiedot["Huoneistoala (m²)"] = buildingResponse.properties['floor_area'];
              feature.properties.teknisettiedot["Tilavuus (m³)"] = buildingResponse.properties['volume'];
              feature.properties.teknisettiedot["Kerroksia"] = buildingResponse.properties['number_of_storeys'];

              feature.properties.rakennustiedot["Rakennusluokitus"] = buildingResponse.properties['main_purpose'];
              feature.properties.rakennustiedot["Runkotapa"] = buildingResponse.properties['construction_method'];
              feature.properties.rakennustiedot["Käytössäolotilanne"] = buildingResponse.properties['usage_status'];
              feature.properties.rakennustiedot["Julkisivun rakennusaine"] = buildingResponse.properties['facade_material'];
              feature.properties.rakennustiedot["Lämmitystapa"] = buildingResponse.properties['heating_method'];
              feature.properties.rakennustiedot["Lämmitysenergianlähde"] = buildingResponse.properties['heating_energy_source'];
              feature.properties.rakennustiedot["Kantavanrakenteen rakennusaine"] = buildingResponse.properties['material_of_load_bearing_structures'];

            }  
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

  const buildrakennusData = (features) => {
      const transformedData = features.map(feature => ({
        type: "Feature",
        id: feature.properties.building_key || feature.id || null,
        geometry: {
            type: "Point",
            coordinates: feature.geometry.coordinates
        },
        properties: {
            yleistiedot: {
                "Rakennustunnus": feature.properties.permanent_building_identifier || null,
                "Kiinteistötunnus": feature.properties.property_identifier || null,
                "Kohteen nimi": null,
                "Kohteen osoite": feature.properties.address_fin || null, 
                "Postinumero" : feature.properties.postal_code || null, 
                "Toimipaikka": feature.properties.postal_office_fin || null, 
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
                "Pohjavesialueella": null,
                "radon arvo": null
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