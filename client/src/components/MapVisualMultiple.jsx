import { useEffect, useMemo, useRef } from 'react';
import { L } from '../assets/leafletHeader';
import 'leaflet/dist/leaflet.css';
import config from '../devprodConfig';

const apiurl = config.apiBaseUrl;
const maptemplate = config.mapTileTemplate;

const MapVisualMultiple = ({ rakennukset_fulls = [], height = '300px' }) => {
    const mapRef = useRef(null);

    const markers = useMemo(() => {
        return rakennukset_fulls
        .map((rakennus, idx) => {
            const coords = rakennus?.sijainti?.coordinates;
            if (!coords || coords.length < 2) return null;

            return {
            lat: coords[1], // Y
            lng: coords[0], // X
            label: `${rakennus?.rakennustunnus} ${rakennus?.rakennusluokitus}` || `Rakennus ${idx + 1}`,
            };
        })
        .filter(Boolean); // Remove nulls
    }, [rakennukset_fulls]);

    useEffect(() => {
        if (!markers || markers.length === 0) return;

        // Use the first marker as the center
        const center = [markers[0].lat, markers[0].lng];

        const map = L.map('map', {
        center: center,
        zoom: 17,
        minZoom: 15,
        maxZoom: 17,
        dragging: true,
        scrollWheelZoom: true,
        zoomControl: false,
        });

        L.Icon.Default.mergeOptions({
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });

        const template = apiurl + maptemplate;
        const defaultTileMatrixSet = 'WGS84_Pseudo-Mercator';

        const getTileUrl = (layerName, tileMatrixSet) =>
        template.replace('{layerName}', layerName).replace('{tileMatrixSet}', tileMatrixSet);

        // Base layers
        const layerBasePublic = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        });

        const layerBaseMap = L.tileLayer(getTileUrl('taustakartta', defaultTileMatrixSet), {
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true,
        });

        const layerBaseMapIlmakuva = L.tileLayer(getTileUrl('ortokuva', defaultTileMatrixSet), {
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true,
        });

        const layerBaseMapSelko = L.tileLayer(getTileUrl('selkokartta', defaultTileMatrixSet), {
        attribution: '&copy; Maanmittauslaitos',
        detectRetina: true,
        });

        const layerKiinteistotunnus = L.tileLayer(getTileUrl('kiinteistotunnukset', defaultTileMatrixSet), {
            detectRetina: false,
        });

        const layerKiinteistorajat = L.tileLayer(getTileUrl('kiinteistojaotus', defaultTileMatrixSet), {
        detectRetina: true,
        });

        const markerLayer = L.layerGroup();
        markers.forEach(({ lat, lng, label }) => {
            const marker = L.marker([lat, lng]);
            if (label) marker.bindPopup(label);
            marker.addTo(markerLayer);
        });

        const baseMaps = {
        'OpenStreetMap': layerBasePublic,
        'Taustakartta': layerBaseMap,
        'Ilmakuva': layerBaseMapIlmakuva,
        'Selkokartta': layerBaseMapSelko,
        };

        const overlayMaps = {
        'Kiinteistötunnukset': layerKiinteistotunnus,
        'Kiinteistörajat': layerKiinteistorajat,
        'Rakennusmerkit': markerLayer, // ✅ Add markerLayer to overlays
        };

        

        layerBaseMap.addTo(map);


        markerLayer.addTo(map); // Add markerLayer by default (optional)

        // Add controls
        L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);
        L.control.zoom({ position: 'topright' }).addTo(map);
        
        

        // Clean up
        return () => {
        map.remove();
        };
    }, [markers]);

    return (
        <div
        id="map"
        ref={mapRef}
        style={{ height, maxWidth: '100%', borderRadius: '12px' }}
        ></div>
    );
};

export default MapVisualMultiple;