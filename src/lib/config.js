/**
 * Frontend URL resolver for Edge/Node runtimes.
 * Priority:
 * 1) Runtime variable (globalThis.FRONTEND_URL or process.env.FRONTEND_URL)
 * 2) Optional local config file (src/lib/appConfig.js)
 * If neither is provided, an error is thrown to instruct user to configure it.
 */

function normalize(url) {
  if (typeof url !== 'string' || !url) {
    throw new Error('FRONTEND_URL is not configured. Please set runtime variable FRONTEND_URL or create src/lib/appConfig.js with exported FRONTEND_URL.');
  }
  // Ensure it has protocol and ends with a single trailing slash
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, '/') ;
}

export async function resolveFrontendUrl() {
  // 1) Runtime variables (EdgeOne Pages may inject globals; Node via process.env)
  const runtimeVar =
    (typeof globalThis !== 'undefined' && globalThis.FRONTEND_URL) ||
    (typeof process !== 'undefined' && process.env && process.env.FRONTEND_URL);

  if (runtimeVar) {
    return normalize(runtimeVar);
  }

  // 2) Optional app config module (user can copy example to appConfig.js)
  try {
    const mod = await import('./appConfig.js'); // optional
    const cfgUrl = mod.FRONTEND_URL || (mod.default && mod.default.FRONTEND_URL);
    if (cfgUrl) {
      return normalize(cfgUrl);
    }
  } catch (_) {
    // appConfig.js not present or failed to load; ignore
  }

  // Neither runtime variable nor local config provided
  throw new Error('FRONTEND_URL is not configured. Please set runtime variable FRONTEND_URL or create src/lib/appConfig.js with exported FRONTEND_URL.');
}