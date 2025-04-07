// Searchbox.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import '../App.css';

// Hakulogiikka on tässä

function Searchbox({ afterSearch }) {

  const [searchQuery, setSearchQuery] = useState("");
  // const [resultsSearchbox, setResultsSearchbox] = useState([]);
  const [rawResults, setRawResults] = useState([]);
  const [results, setResults] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true); // Add this to show loading state
    console.log("Searching for:", searchQuery);
  
    try {
      const response = await axios.get(`https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&CQL_FILTER=property_identifier='${searchQuery}'&SRSNAME=EPSG:4326`);
      setRawResults(response.data);
      console.log("async handlesearch", response.data);
    } catch (err) {
      setError("An error occurred during the search.");
    } finally {
      setLoading(false); // Reset loading after fetching data
    }
  };

  useEffect(() => {
    if (rawResults?.features?.length > 0) {
        const transformedData = rawResults.features.map(feature => ({
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

        setResults(transformedData);
        console.log("Transformed data - uef[rawResults]",transformedData)

    }
  }, [rawResults]);

  useEffect(() => {
    afterSearch(results)

  }, [results, afterSearch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key
    }
  };

  return (
    <div className='search-container'>
      <div className="mt-4">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Hae kiinteistötunnuksella..."
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