/**
 * Shared constants for World Anvil API integration
 */

export const WORLD_ANVIL_BASE_URL = 'https://www.worldanvil.com/api/external/boromir';
export const TOKEN_EXPIRATION_SECONDS = 24 * 60 * 60; // 24 hours
export const WA_TOKEN_STORAGE_KEY = 'WA_TOKEN';

// API endpoints
export const API_ENDPOINTS = {
  IDENTITY: '/identity',
  USER_WORLDS: '/user/worlds',
  WORLD_ARTICLES: '/world/articles',
  ARTICLE: '/article',
  SECRET: '/secret'
} as const;

// HTTP headers
export const API_HEADERS = {
  AUTH_TOKEN: 'x-auth-token',
  APPLICATION_KEY: 'x-application-key',
  CONTENT_TYPE: 'application/json',
  ACCEPT: 'application/json'
} as const;