import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import '../App.css';
import Searchbox from '../components/Searchbox';
import Resultdisplay from '../components/Resultsdisplay';
import MapVisual from '../components/MapVisual';
import Search from '../components/Search';
import ResultdisplayRF from '../components/ResultDisplayRF';



function Home() {
  const [searchResults, setSearchResults] = useState([])

  const [kiinteistoObjects, setKiinteistoOjbects] = useState([])
  const [kiinteistotJson, setKiinteistotJson]  = useState([])


  const afterSearch = (results) => {
    // setSearchResults(results)
    setKiinteistoOjbects(results);
  };



  useEffect(() => {
    if (kiinteistoObjects.length > 0) {
      const jsonData = kiinteistoObjects.map(obj => obj.toGeoJSON());
      setKiinteistotJson(jsonData);
      console.log('UEF HOME jsonData',jsonData)
    }
 
  }, [kiinteistoObjects]);



  const [coordinates, setCoordinates] = useState([])

  const setMapCoords = (coords) =>{
    setCoordinates([coords[1],coords[0]])
  }

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
          <MapVisual pos={coordinates} data={searchResults} />
        </div>
      </div>
      
      {kiinteistotJson.length > 0 ? (
            <ResultdisplayRF data={kiinteistotJson} setMapCoords={setMapCoords} />
          ) : (
            <>
            </>
      )}

    </div>
    </>
  );
}

export default Home;

