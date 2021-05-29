export const DOMAIN = process.env.SERVER === 'development'
  ? process.env.REACT_APP_URL_DEV
  : process.env.SERVER === 'production'
  ? process.env.REACT_APP_URL
  : 'http://localhost';
export const baseURL = `${DOMAIN}:8000`;
