import { MapContainer, WMSTileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CRS } from "leaflet";

const MapComponent = () => {
  // Define center and zoom level
  const center = [7393037, 374003]; // Replace with your coordinates
  const zoom = 13;

  // WMS URL and BBOX
  const wmsUrl = "https://paikkatiedot.ymparisto.fi/geoserver/ryhti_building/ows";
  const bbox = "373953,7392987,374053,7393087"; // Replace with dynamic BBOX from WFS or your needs

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "500px", width: "100%" }}>
      {/* WMS Tile Layer */}
      <WMSTileLayer
        url={wmsUrl}
        params={{
          SERVICE: "WMS",
          VERSION: "1.3.0",
          REQUEST: "GetMap",
          LAYERS: "open_address",
          STYLES: "",
          CRS: "EPSG:3067",
          WIDTH: 256,
          HEIGHT: 256,
          FORMAT: "image/png",
          BBOX: bbox, // Using the BBOX you provided or dynamically generated
        }}
      />
      {/* Optionally add markers or other elements */}
    </MapContainer>
  );
};


export default MapComponent;
