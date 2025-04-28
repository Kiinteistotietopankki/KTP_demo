import React, { useEffect, useRef, useState } from 'react';
import { basicTileHeader, L } from '../assets/leafletHeader'; 
import 'leaflet/dist/leaflet.css';




const apiKey = process.env.REACT_APP_API_KEY;

const MapVisual = ({ pos = [65.00816937, 25.46030678], coords}) => {
  
  const [position, setPosition] = useState([pos[0],pos[1]])

  const username = apiKey;
  const password = apiKey;

  // Combine username and password in the format "username:password"
  const combined = `${username}:${username}`;

// Encode the combined string in Base64
  const base64UserNameAndPassword = btoa(combined);

  const mapRef = useRef(null);
  // const position = [pos[0], pos[1]]


  useEffect(() => {
    if (coords && coords.length > 0) {
      // Check if the new coordinates are different from the current position
      const isDifferent = coords[0] !== position[0] || coords[1] !== position[1];
      
      if (isDifferent) {
        setPosition([coords[0], coords[1]]);
        console.log('MapVisual coords updated:', coords);
      } else {
        console.log('Coordinates are the same, not updating position');
      }
    }
  }, [coords]);

  useEffect(() => {
    console.log('POSTION SET UEF')
    const map = L.map('map', {
      center: position,
      zoom: 16,
      minZoom: 15,
      maxZoom: 17,
      dragging: false,
      scrollWheelZoom: false
    });

    L.Icon.Default.mergeOptions({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      });

    // console.log(apiKey)
    // console.log(encodeURIComponent(apiKey));
    const template = `https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/{layerName}/default/{tileMatrixSet}/{z}/{y}/{x}.png?`;

    // Layers

    const layerBasePublic = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    const layerBaseMap = basicTileHeader(
      template,
      {
        tileMatrixSet: 'WGS84_Pseudo-Mercator',
        layerName: 'taustakartta',
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true,
      },
      [{ header: 'Authorization', value: `Basic ${base64UserNameAndPassword}` }],
      null
    );

    const layerBaseMapIlmakuva = basicTileHeader(template, {
        tileMatrixSet: 'WGS84_Pseudo-Mercator',
        layerName: 'ortokuva',
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true
      },
      [{ header: 'Authorization', value: `Basic ${base64UserNameAndPassword}` }],
      null
  );

    const layerBaseMapSelko = basicTileHeader(template, {
        tileMatrixSet: 'WGS84_Pseudo-Mercator',
        layerName: 'selkokartta',
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true
        },
        [{ header: 'Authorization', value: `Basic ${base64UserNameAndPassword}` }],
        null
      );

    const layerKiinteistotunnus = basicTileHeader(template, {
      tileMatrixSet: 'WGS84_Pseudo-Mercator',
      layerName: 'kiinteistotunnukset',
      detectRetina: true
      },
      [{ header: 'Authorization', value: `Basic ${base64UserNameAndPassword}` }],
      null
    );

    const layerKiinteistorajat = basicTileHeader(template, {
      tileMatrixSet: 'WGS84_Pseudo-Mercator',
      layerName: 'kiinteistojaotus',
      detectRetina: true
      },
      [{ header: 'Authorization', value: `Basic ${base64UserNameAndPassword}` }],
      null
    );


    // Create layer control
    const baseMaps = {
      'OpenStreetMap' : layerBasePublic,
      'Taustakartta': layerBaseMap,
      'Ilmakuva': layerBaseMapIlmakuva,
      'Selkokartta': layerBaseMapSelko
    };

    const overlayMaps = {
      'Kiinteistötunnukset': layerKiinteistotunnus,
      'Kiinteistörajat': layerKiinteistorajat
    };

    // Add default layer
    layerBasePublic.addTo(map);

    L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);


    const marker = L.marker(position).addTo(map);
    // marker.bindPopup('Default Icon Popup');

    // Clean up
    return () => {
      map.remove();
    };
  }, [position]);

  return (
    // <div className='mapcont mt-5 mb-5'>
      <div id='map' ref={mapRef} style={{ height: '300px', maxWidth: '100%',  borderRadius: '12px',}}>
      </div>
    // </div>
  );
};

export default MapVisual;
