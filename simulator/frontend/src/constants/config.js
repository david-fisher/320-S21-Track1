export const DOMAIN = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_URL
  : 'http://127.0.0.1';
export const BACK_URL_SIMULATOR = `${DOMAIN}:7000`;
export const BACK_URL_EDITOR = `${DOMAIN}:8000`;
export const SCENARIO_ID = 1;
export const STUDENT_ID = 'enochhsiao';
export const DEV = !(process.env.NODE_ENV === 'production');
