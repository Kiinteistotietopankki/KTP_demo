import { useEffect, useRef, useState } from 'react';
import { L } from '../assets/leafletHeader'; 
import 'leaflet/dist/leaflet.css';



const apiKey = process.env.REACT_APP_API_KEY;
const apiurl = process.env.REACT_APP_API_URL
const maptemplate = process.env.REACT_APP_API_MAP_TEMPLATE

const MapVisual = ({ pos = [64.22165784, 27.72696699], coords}) => {
  
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
        zoom: 17,
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

      const template = apiurl+maptemplate

      // Layers

      const layerBasePublic = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      const defaultTileMatrixSet = 'WGS84_Pseudo-Mercator';

      const getTileUrl = (layerName, tileMatrixSet) => 
        template
          .replace('{layerName}', layerName)
          .replace('{tileMatrixSet}', tileMatrixSet);

      const layerBaseMap = L.tileLayer(getTileUrl('taustakartta',defaultTileMatrixSet), {
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true,
      });

      const layerBaseMapIlmakuva = L.tileLayer(getTileUrl('ortokuva',defaultTileMatrixSet), {
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true,
      });

      const layerBaseMapSelko = L.tileLayer(getTileUrl('selkokartta',defaultTileMatrixSet), {
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true,
      });

      const layerKiinteistotunnus = L.tileLayer(getTileUrl('kiinteistotunnukset',defaultTileMatrixSet), {
        detectRetina: true,
      });

      const layerKiinteistorajat = L.tileLayer(getTileUrl('kiinteistojaotus',defaultTileMatrixSet), {
        detectRetina: true,
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
      layerBaseMap.addTo(map);

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
