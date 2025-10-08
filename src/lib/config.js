/**
 * Frontend URL resolver for Edge/Node runtimes.
 * Priority:
 * 1) Runtime variable (globalThis.FRONTEND_URL or process.env.FRONTEND_URL)
 * 2) Local config file (src/lib/appConfig.js) - always present in repo as placeholder
 * If neither provides a valid value, an error is thrown to instruct user to configure it.
 */

function normalize(url) {
  if (typeof url !== 'string' || !url) {
    throw new Error('FRONTEND_URL is not configured. Please set runtime variable FRONTEND_URL or edit config/appConfig.js to export a non-empty FRONTEND_URL.');
  }
  // Ensure it has protocol and ends with a single trailing slash
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, '/') ;
}

import { FRONTEND_URL as CFG_URL } from '../../config/appConfig.js';

export async function resolveFrontendUrl() {
  // 1) Runtime variables (EdgeOne Pages may inject globals; Node via process.env)
  const runtimeVar =
    (typeof globalThis !== 'undefined' && globalThis.FRONTEND_URL) ||
    (typeof process !== 'undefined' && process.env && process.env.FRONTEND_URL);
  if (runtimeVar) {
    return normalize(runtimeVar);
  }

  // 2) Local config file (present at build time)
  if (typeof CFG_URL !== 'undefined' && CFG_URL) {
    return normalize(CFG_URL);
  }

  // Neither runtime variable nor local config provided a valid value
  throw new Error('FRONTEND_URL is not configured. Please set runtime variable FRONTEND_URL or edit config/appConfig.js to export FRONTEND_URL.');
}