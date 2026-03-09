/**
 * Shared constants for World Anvil API integration
 */

// Use Cloudflare Worker proxy to bypass Cloudflare bot protection
// Set WA_PROXY_URL (backend) or VITE_WA_PROXY_URL (frontend) in .env to use a Cloudflare Worker proxy
// When using proxy: endpoints are just /identity, /user/worlds, etc. (worker adds /api/external/boromir)
// When not using proxy: base URL includes /api/external/boromir, endpoints are the same

// Type guard for Node.js process.env
declare const process: { env: Record<string, string | undefined> } | undefined;

// Get proxy URL from environment - handle both Node.js and Vite environments
let PROXY_URL: string | undefined;
try {
  if (typeof process !== "undefined" && process?.env) {
    PROXY_URL = process.env.WA_PROXY_URL;
  }
} catch {
  // Not in Node.js environment
}

// If not set from Node.js, try Vite env (must be accessed directly, not dynamically)
if (!PROXY_URL && typeof import.meta !== "undefined") {
  PROXY_URL = import.meta.env?.VITE_WA_PROXY_URL;
}

// If using proxy, just the worker URL; otherwise include the full API path
export const WORLD_ANVIL_BASE_URL =
  PROXY_URL || "https://www.worldanvil.com/api/external/boromir";
export const TOKEN_EXPIRATION_SECONDS = 24 * 60 * 60; // 24 hours
export const WA_TOKEN_STORAGE_KEY = "WA_TOKEN";

// API endpoints - these work for both direct calls and through the worker
export const API_ENDPOINTS = {
  IDENTITY: "/identity",
  USER_WORLDS: "/user/worlds",
  WORLD_ARTICLES: "/world/articles",
  ARTICLE: "/article",
  SECRET: "/secret",
} as const;

// HTTP headers
export const API_HEADERS = {
  AUTH_TOKEN: "x-auth-token",
  APPLICATION_KEY: "x-application-key",
  CONTENT_TYPE: "application/json",
  ACCEPT: "application/json",
} as const;
