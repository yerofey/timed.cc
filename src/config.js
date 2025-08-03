export const isDev = import.meta.env.IS_LOCAL === 'true';
export const isProd = import.meta.env.PROD === true;

export const apiBasePath = import.meta.env.VITE_API_BASE_PATH || '/api';
export const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173';

export const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

export default {
  isDev,
  isProd,
  apiBasePath,
  websiteUrl,
  encryptionKey,
};
