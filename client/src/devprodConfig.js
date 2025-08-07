const isProd = process.env.REACT_APP_ENVIRONMENT;
const produrl = process.env.REACT_APP_PROD_API_URL
const devurl = process.env.REACT_APP_DEV_API_URL


const config = {
  apiBaseUrl: isProd
    ? produrl
    : devurl,

  mapTileTemplate: '/api/kartat/fetch-tile/{layerName}/{tileMatrixSet}/{z}/{y}/{x}'
};

export { isProd };
export default config;