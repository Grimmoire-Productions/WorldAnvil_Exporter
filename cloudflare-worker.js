/**
 * Cloudflare Worker - WorldAnvil API Proxy
 *
 * This worker acts as a proxy to bypass Cloudflare's bot protection
 * when making server-to-server API calls to WorldAnvil.
 *
 * Source: https://github.com/Tillerz/worldanvil-templates/blob/master/tools/backup/cloudflare/worker.js
 */

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const originalHostURL = "https://www.worldanvil.com/api/external/boromir";
  const url = new URL(request.url);
  const apiEndpoint = url.pathname.replace("/proxy", "");
  const queryString = url.search;

  const newUrl = `${originalHostURL}${apiEndpoint}${queryString}`;

  // Copy original headers but filter out problematic ones
  const headers = new Headers(request.headers);

  // Remove host header (will be set automatically)
  headers.delete("host");

  // Add browser-like headers if not already present to help bypass bot detection
  if (!headers.has("accept")) {
    headers.set("accept", "application/json, text/plain, */*");
  }
  if (!headers.has("accept-language")) {
    headers.set("accept-language", "en-US,en;q=0.9");
  }
  if (!headers.has("sec-fetch-dest")) {
    headers.set("sec-fetch-dest", "empty");
  }
  if (!headers.has("sec-fetch-mode")) {
    headers.set("sec-fetch-mode", "cors");
  }
  if (!headers.has("sec-fetch-site")) {
    headers.set("sec-fetch-site", "cross-site");
  }

  const newRequest = new Request(newUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
  });

  const response = await fetch(newRequest);

  // Add CORS headers to response
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  newResponse.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, x-auth-token, x-application-key, authorization",
  );

  return newResponse;
}
