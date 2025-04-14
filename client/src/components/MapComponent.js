import React from 'react';
import { MapContainer, WMSTileLayer } from "react-leaflet";
import L, { vectorGrid } from "leaflet";
import "leaflet/dist/leaflet.css";





const MapComponent = () => {

  const username = "Waativakarttakoe";
  const password = "Karttamiesukko12";
  
  // Base64 encode the credentials
  const base64Credentials = btoa(`${username}:${password}`);


  // wms?service=WMS&version=1.3.0&request=GetMap&layers=public:taustakartta&SRSNAME=EPSG:4326
  const wmsUrl = "https://sopimus-karttakuva.maanmittauslaitos.fi/sopimus/service/wms?SRSNAME=EPSG:4326"
  
  return (
    <div>
      <MapContainer 
        center={[60.3219, 24.7481]} 
        zoom={8} 
        style={{ width: '100%', height: '100%' }}
      >

        <WMSTileLayer
          url=''
          layers='public:taustakartta'
        ></WMSTileLayer>
        


      </MapContainer>
    </div>
  );
};

export default MapComponent;
