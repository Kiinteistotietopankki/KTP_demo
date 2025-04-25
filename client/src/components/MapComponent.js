import React, { useEffect, useRef } from 'react';
import L from 'leaflet'; // Import Leaflet

import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS¨

// VANHA!!! EI KÄYTÖSSÄ, Säilössä hetken

const MapComponent = () => {
  const mapRef = useRef(null);

  const projectedPoint = L.point(2834228.3862621, 9610523.68631807); 


  useEffect(() => {
    // Create the map and set the initial view
    const map = L.map(mapRef.current, {
      center: [64.91089078, 25.52603082], // Starting position
      zoom: 13, // Zoom level
      // scrollWheelZoom: false,
    });

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add the WMS layer
    const wmsLayer = L.TileLayer.wms('https://sopimus-karttakuva.maanmittauslaitos.fi/sopimus/service/wms?SRSNAME=EPSG:4326&', {
      layers: 'public:peruskartta_taustavari',
      headers: {
        'Authorization': 'Basic ' + btoa('Waativakarttakoe:Karttamiesukko12') // Replace with your actual username and password
      }
    }).addTo(map);

    var wmsLayer = L.tileLayer.wmsHeader(
      'https://sopimus-karttakuva.maanmittauslaitos.fi/sopimus/service/wms?',
      {
          layers: 'public:taustakartta',
          format: 'image/png',
          transparent: true,
      },
      [
        { 
            header: 'Authorization', 
            value: `Basic ${btoa(username + ':' + password)}` 
        },
      ],
      null
  ).addTo(map);

    // Clean up when the component is unmounted
    return () => {
      // map.removeLayer(wmsLayer);
      map.remove();
    };
  }, []);

  return (
    <div id="map" ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
  );
};

export default MapComponent;