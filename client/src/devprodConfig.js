const isProd = false;

const config = {
  apiBaseUrl: isProd
    ? 'https://ktpapi-b9bpd4g9ewaqa4af.swedencentral-01.azurewebsites.net'
    : 'http://localhost:3001',

  mapTileTemplate: '/api/kartat/fetch-tile/{layerName}/{tileMatrixSet}/{z}/{y}/{x}'
};

export { isProd };
export default config;