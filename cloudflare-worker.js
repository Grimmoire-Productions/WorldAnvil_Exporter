/**
 * Cloudflare Worker - WorldAnvil API Proxy
 *
 * This worker acts as a proxy to bypass Cloudflare's bot protection
 * when making server-to-server API calls to WorldAnvil.
 *
 * Source: https://github.com/Tillerz/worldanvil-templates/blob/master/tools/backup/cloudflare/worker.js
 *
 * Deployment instructions:
 * 1. Go to https://dash.cloudflare.com/
 * 2. Navigate to Workers & Pages
 * 3. Create a new Worker
 * 4. Copy this code into the worker
 * 5. Deploy the worker
 * 6. Copy the worker URL (e.g., https://your-worker.your-subdomain.workers.dev)
 * 7. Add WA_PROXY_URL=<worker-url> to server/.env (no /api/external/boromir needed)
 *
 * Example usage:
 * Instead of: https://www.worldanvil.com/api/external/boromir/identity
 * Use: https://your-worker.your-subdomain.workers.dev/api/external/boromir/identity
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const originalHostURL = 'https://www.worldanvil.com/api/external/boromir'
  const url = new URL(request.url)
  const apiEndpoint = url.pathname.replace('/proxy', '')
  const queryString = url.search

  const newUrl = `${originalHostURL}${apiEndpoint}${queryString}`
  const newRequest = new Request(newUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })

  return fetch(newRequest)
}
