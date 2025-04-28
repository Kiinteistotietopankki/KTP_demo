import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

async function fetchImage(url, callback, headers, abort) {
  let _headers = {};
  if (headers) {
    headers.forEach(h => {
      _headers[h.header] = h.value;
    });
  }
  const controller = new AbortController();
  const signal = controller.signal;
  if (abort) {
    abort.subscribe(() => {
      controller.abort();
    });
  }
  const f = await fetch(url, {
    method: "GET",
    headers: _headers,
    mode: "cors",
    signal: signal
  });
  const blob = await f.blob();
  callback(blob);
}

// Correct: Capital TileLayer, because you are EXTENDING a class
L.TileLayer.BasicTileHeader = L.TileLayer.extend({
  initialize: function (url, options, headers, abort, results) {
    L.TileLayer.prototype.initialize.call(this, url, options);
    this.headers = headers;
    this.abort = abort;
    this.results = results;
  },

  createTile(coords, done) {
    const url = this.getTileUrl(coords);  // URL for the WMTS or tile layer
    const img = document.createElement("img");
    img.setAttribute("role", "presentation");

    const self = this;  // ← You forgot "const" before self originally

    fetchImage(
      url,
      resp => {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
          if (self.results) {
            self.results.next(reader.result);
          }
        };
        reader.readAsDataURL(resp);
        done(null, img);
      },
      this.headers,
      this.abort
    );
    return img;
  }
});

// Correct: Factory function small "tileLayer", capital "TileLayer"
const basicTileHeader = (url, options, headers, abort, results) => {
    return new L.TileLayer.BasicTileHeader(url, options, headers, abort, results);
};

export { basicTileHeader, L };