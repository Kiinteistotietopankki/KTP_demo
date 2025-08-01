const isProd = process.env.REACT_APP_ENVIRONMENT;
const produrl = process.env.REACT_APP_PROD_API_URL
const devurl = process.env.REACT_APP_DEV_API_URL

const config = {
  apiBaseUrl: isProd
    ? 'https://ktpapi-b9bpd4g9ewaqa4af.swedencentral-01.azurewebsites.net'
    : 'http://localhost:3001',

  mapTileTemplate: '/api/kartat/fetch-tile/{layerName}/{tileMatrixSet}/{z}/{y}/{x}'
};

export { isProd };
export default config;