import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import '../App.css';
import Searchbox from '../components/Searchbox';
import Resultdisplay from '../components/Resultsdisplay';



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
      
      {searchResults && searchResults.length > 0 ? (
        <Resultdisplay data={searchResults}></Resultdisplay>
          ):(
          <></>
          )}
      
    </div>
  );
}

export default Home;

