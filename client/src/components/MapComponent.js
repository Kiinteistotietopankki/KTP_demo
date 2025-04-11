import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
const MapComponent = () => {

  const position = [427421,7210249]
  const vectorTileURL = 'https://avoinkarttakuva.maanmittauslaitos.fi/vectortiles/taustakartta/wmts/1.0.0/taustakartta/default/v20/WGS84_Pseudo-Mercator/{z}/{x}/{y}.pbf?api-key=d427e2b3-e5c1-43fd-b431-a16ba26df92f';

  return (
    <div>
          {/* <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100vh", width: "100%" }}
          >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://avoin-karttakuva.maanmittauslaitos.fi/kiinteisto-avoin/tiles/wmts/1.0.0/kiinteistojaotus/default/v3/ETRS-TM35FIN/{z}/{y}/{x}.pbf?api-key=f11f6c03-fe6a-43bb-89b0-6370cd03509b"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer> */}
      <MapContainer center={[60.192059, 24.945831]} zoom={12} style={{ width: '100%', height: '100%' }}>
        {/* MVT-vektoritiili taustakartaksi */}
        <TileLayer
        url={vectorTileURL}
        tileSize={512}  // MVT-vektoritiilien tyypillinen koko
        maxZoom={18}    // Maksimi zoom-taso
        minZoom={10}    // Minimi zoom-taso
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
