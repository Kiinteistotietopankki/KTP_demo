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


    <div className="main-content">
      <div className="bg-success text-white d-flex align-items-center justify-content-center shadow-sm" style={{ minHeight: '20vh' }}>
        <header className="w-100 px-3 mt-3 text-center">
          <h1 className="fw-bold fs-4 display-5 mb-3">
            Hae kiinteistöjä
          </h1>

          <div className="mx-auto" style={{ maxWidth: '600px' }}>
            <Search afterSearch={afterSearch}></Search>
          </div>
        </header>
      </div>


    <div className='container'>
      {kiinteistotJson.length > 0 ? (
            <Resultdisplay data={kiinteistotJson} setMapCoords={setMapCoords} />
          ) : (
            <>
            </>
      )}
    </div>

  </div>
    // <div className="container-fluid mt-3 p-3">
    //   <div className="row">
    //     <div className="col-md-6 mt-3">

    //       {/* <Searchbox/> */}
    //       <Search afterSearch={afterSearch}></Search>


    //     </div>

    //     {/* RIGHT side: map */}
    //     <div className="col-md-6 mt-2">
    //       {/* <MapVisual pos={[64.22165784, 27.72696699]} coords={coordinates}/> */}
    //     </div>
    //   </div>
      


    // </div>
  );
}

export default Home;

