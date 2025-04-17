import React, { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import '../App.css';
import Searchbox from '../components/Searchbox';
import Resultdisplay from '../components/Resultsdisplay';
import MapVisual from '../components/MapVisual';
import Search from '../components/Search';



function Home() {
  const [searchResults, setSearchResults] = useState([]);


  const afterSearch = (results) => {
    setSearchResults(results)
  };

  return (
    <>
    <h1 className="otsikko text-primary mb-1 mx-auto">
      Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
    </h1>
    <div className="container mt-3">
      <div className="row">
        {/* LEFT side: text + search + results */}
        <div className="col-md-6 mt-3">

          {/* <Searchbox/> */}
          <Search afterSearch={afterSearch}></Search>


        </div>

        {/* RIGHT side: map */}
        <div className="col-md-6 mt-2">
          <MapVisual pos={[65.00816937, 25.46030678]} data={searchResults} />
        </div>
      </div>
      {searchResults.length > 0 ? (
            <Resultdisplay data={searchResults} />
          ) : (
            <>
            </>
          )}
    </div>
    </>
  );
}

export default Home;

