import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const apiKey = process.env.API_KEY;

const MapVisual = ({ pos = [65.00816937, 25.46030678], data }) => {

  const [rakennukset, setRakennukset] = useState([]);
  const [position, setPosition] = useState([pos[0],pos[1]])

  const mapRef = useRef(null);
  // const position = [pos[0], pos[1]]

  useEffect(() => {
    setRakennukset(data);
    console.log('MAP VISUAL TESTING: ',data?.[0]?.geometry?.coordinates)
    setPosition([data?.[0]?.geometry?.coordinates[1],data?.[0]?.geometry?.coordinates[0]])
  }, [data]);

  useEffect(() => {
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

    const template = `https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/{layerName}/default/{tileMatrixSet}/{z}/{y}/{x}.png?apiKey=${apiKey}`;


    // Layers

    const layerBasePublic = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    const layerBaseMap = L.tileLayer(template, {
      tileMatrixSet: 'WGS84_Pseudo-Mercator',
      layerName: 'taustakartta',
      attribution: '&copy; Maanmittauslaitos',
      detectRetina: true
    });

    const layerBaseMapIlmakuva = L.tileLayer(template, {
        tileMatrixSet: 'WGS84_Pseudo-Mercator',
        layerName: 'ortokuva',
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true
    });

    const layerBaseMapSelko = L.tileLayer(template, {
        tileMatrixSet: 'WGS84_Pseudo-Mercator',
        layerName: 'selkokartta',
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true
    });

    const layerKiinteistotunnus = L.tileLayer(template, {
      tileMatrixSet: 'WGS84_Pseudo-Mercator',
      layerName: 'kiinteistotunnukset',
      detectRetina: true
    });

    const layerKiinteistorajat = L.tileLayer(template, {
      tileMatrixSet: 'WGS84_Pseudo-Mercator',
      layerName: 'kiinteistojaotus',
      detectRetina: true
    });


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
