export const DOMAIN = process.env.SERVER === 'development'
  ? process.env.REACT_APP_URL_DEV
  : process.env.SERVER === 'production'
  ? process.env.REACT_APP_URL
  : 'http://localhost';
export const BACK_URL = `${DOMAIN}:7000/backend`;
export const SCENARIO_ID = 1;
export const STUDENT_ID = 1;
export const DEV_MODE = false;
