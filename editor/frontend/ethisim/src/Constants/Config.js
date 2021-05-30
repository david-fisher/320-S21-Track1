export const DOMAIN =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_URL
        : 'http://localhost';
export const baseURL = DOMAIN + ':8000';
