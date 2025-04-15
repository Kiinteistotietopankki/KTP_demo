import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import '../App.css';
import Searchbox from '../components/Searchbox';
import Resultdisplay from '../components/Resultsdisplay';
import MapVisual from '../components/MapVisual';



function Home() {
  const [searchResults, setSearchResults] = useState([]);


  const afterSearch = (results) => {
    setSearchResults(results)
  };

  return (
    <div className="container mt-3">
      <h1 className="otsikko text-primary mb-5">
        Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
      </h1>

      <Searchbox afterSearch={afterSearch} />


      {/* <MapVisual pos={[65.00816937,25.46030678]}></MapVisual> */}
      
      {searchResults.length > 0 ? (
        <Resultdisplay data={searchResults}></Resultdisplay>
      ):(
        <div></div>
      )}
      

      
    </div>
  );
}

export default Home;

