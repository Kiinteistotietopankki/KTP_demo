import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import '../App.css';
import Searchbox from '../components/Searchbox';
import axios from 'axios'; 
import Rakennustable from '../components/Rakennustable';



function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchQuery) => {


    try {
      const response = await axios.get(`https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=ryhti_building:open_building&outputFormat=application/json&CQL_FILTER=property_identifier='${searchQuery}'&SRSNAME=EPSG:4326`);
      setSearchResults(response.data); // Set results to state
    } catch (err) {
      setError("An error occurred during the search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-primary">
        Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
      </h1>

      <Searchbox onSearch={handleSearch} />
      
      {searchResults.features && searchResults.features.length > 0 ? (
        <Rakennustable data={searchResults}></Rakennustable>
          ):(
          <></>
          )}

    </div>
  );
}

export default Home;

