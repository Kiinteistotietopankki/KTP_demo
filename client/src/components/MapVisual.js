import React, { useEffect, useRef } from 'react';
import L from 'leaflet'; // Import Leaflet

import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS¨
const apiKey = process.env.API_KEY;  // Access the API key from the environment variables
  
const MapVisual = () => {
    const mapRef = useRef(null);
  
    useEffect(() => {
      // Create the map and set the initial view
      var apiKey = 'f8a1b3f2-6fce-4dc8-a560-b59c7cc446bb';

      var map = L.map('map', {
        center: [64.91089078, 25.52603082],
        zoom: 17,
        minZoom: 16,
        maxZoom: 18,
        dragging: false,
        scrollWheelZoom: false // Disables zooming with mouse wheel
      })
      
      var template =
      `https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/{tileMatrixSet}/{z}/{y}/{x}.png?apiKey=${apiKey}`;
      
      var layer = L.tileLayer(template, {
        tileMatrixSet: 'WGS84_Pseudo-Mercator'
      }).addTo(map);


  
      // Clean up when the component is unmounted
      return () => {
        map.removeLayer(layer);
        map.remove();
      };
    }, []);
  
    return (
        <div className='mapcont mt-5 mb-5'>
            <div id="map" ref={mapRef} style={{ height: '300px', maxWidth: '70%'}}></div>
        </div>
    );
  };
  
  
  export default MapVisual;