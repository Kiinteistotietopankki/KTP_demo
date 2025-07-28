import { useEffect, useState } from 'react';
import '../App.css';
import Resultdisplay from '../components/Resultsdisplay';
import MapVisual from '../components/MapVisual';
import Search from '../components/Search';




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
      // Assume kiinteistoObjects already contain the correct GeoJSON structure
      setKiinteistotJson(kiinteistoObjects);
      console.log('UEF HOME kiinteistoObjects as-is:', kiinteistoObjects);
    }
 
  }, [kiinteistoObjects]);



  const [coordinates, setCoordinates] = useState([])

  const setMapCoords = (coords) =>{
    setCoordinates([coords[1],coords[0]])
  }

  return (
    <>
    {/* <h1 className="otsikko text-primary mb-1 mx-auto">
      Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
    </h1> */}
    <div className="container-fluid mt-3">
      <div className="row">
        {/* LEFT side: text + search + results */}
        <div className="col-md-6 mt-3">

          {/* <Searchbox/> */}
          <Search afterSearch={afterSearch}></Search>


        </div>

        {/* RIGHT side: map */}
        <div className="col-md-6 mt-2">
          <MapVisual pos={[64.22165784, 27.72696699]} coords={coordinates}/>
        </div>
      </div>
      
      {kiinteistotJson.length > 0 ? (
            <Resultdisplay data={kiinteistotJson} setMapCoords={setMapCoords} />
          ) : (
            <>
            </>
      )}

    </div>
    </>
  );
}

export default Home;

