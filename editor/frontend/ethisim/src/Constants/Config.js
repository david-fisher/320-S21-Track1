export const DOMAIN = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_URL
  : 'http://localhost';
export const BACK_URL_EDITOR = `${DOMAIN}:8000`;
export const BACK_URL_SIMULATOR = `${DOMAIN}:7000`;
export const DEV = !(process.env.NODE_ENV === 'production');
// export const APIUSER = DEV ? 'dev' : 'integration'
// export const APIKEY = process.env.REACT_APP_APIKEY
