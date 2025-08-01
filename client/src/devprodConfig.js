const isProd = process.env.REACT_APP_ENVIRONMENT;

const config = {
  apiBaseUrl: isProd
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL,

  mapTileTemplate: '/api/kartat/fetch-tile/{layerName}/{tileMatrixSet}/{z}/{y}/{x}'
};

export { isProd };
export default config;