export const DOMAIN = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_URL
  : 'http://localhost';
export const BACK_URL_EDITOR = `${DOMAIN}:8000`;
export const BACK_URL_SIMULATOR = `${DOMAIN}:7000/backend`;
export const PRODUCTION = process.env.NODE_ENV === 'production';
