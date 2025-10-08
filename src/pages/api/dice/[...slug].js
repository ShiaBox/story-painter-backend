import { generateRandomString, generateStorageData } from '../../../lib/utils';
import { resolveFrontendUrl } from '../../../lib/config.js';

// 指定此API路由在Edge运行时中执行
export const runtime = 'edge';

const FILE_SIZE_LIMIT_MB = 2;

/**
 * 设置CORS响应头
 * @param {string} methods - 允许的HTTP方法
 * @returns {object}
 */
const getCorsHeaders = (frontendUrl, methods = 'GET, PUT, OPTIONS') => ({
  'Access-Control-Allow-Origin': frontendUrl.slice(0, -1),
  'Access-Control-Allow-Methods': methods,
  'Access-Control-Allow-Headers': 'Content-Type, Accept-Version',
});

/**
 * 统一处理所有 /api/dice/* 的请求
 * @param {Request} request
 */
export default async function handler(request) {
  const { pathname, searchParams } = new URL(request.url);

  // 统一处理CORS预检请求
  let FRONTEND_URL;
  try {
    FRONTEND_URL = await resolveFrontendUrl();
  } catch (e) {
    const msg = (e && e.message) ? e.message : 'FRONTEND_URL is not configured. Please set runtime variable FRONTEND_URL or create src/lib/appConfig.js.';
    return new Response(msg, { status: 500 });
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(FRONTEND_URL) });
  }

  // 检查KV命名空间是否已绑定
  // 在腾讯云EdgeOne环境中，KV绑定是作为全局变量注入的
  if (typeof XBSKV === 'undefined') {
    return new Response('KV_BINDING_ERROR: KV namespace "XBSKV" is not available. Please check your EdgeOne Pages configuration.', { status: 500 });
  }

  // --- 路由1: 上传日志 ---
  if (pathname.endsWith('/api/dice/log') && request.method === 'PUT') {
    try {
      const contentLength = request.headers.get('Content-Length');
      if (contentLength && parseInt(contentLength, 10) > FILE_SIZE_LIMIT_MB * 1024 * 1024) {
        return new Response(
          JSON.stringify({ success: false, message: `File size exceeds ${FILE_SIZE_LIMIT_MB}MB limit` }),
          { status: 413, headers: { ...getCorsHeaders(FRONTEND_URL, 'PUT, OPTIONS'), 'Content-Type': 'application/json' } }
        );
      }

      const formData = await request.formData();
      const name = formData.get("name");
      const file = formData.get("file");
      const uniform_id = formData.get("uniform_id");

      if (!/^[^:]+:\d+$/.test(uniform_id)) {
        return new Response(
          JSON.stringify({ data: "uniform_id field did not pass validation" }),
          { status: 400, headers: { ...getCorsHeaders(FRONTEND_URL, 'PUT, OPTIONS'), 'Content-Type': 'application/json' } }
        );
      }

      if (file.size > FILE_SIZE_LIMIT_MB * 1024 * 1024) {
        return new Response(
          JSON.stringify({ data: "Size is too big!" }),
          { status: 413, headers: { ...getCorsHeaders(FRONTEND_URL, 'PUT, OPTIONS'), 'Content-Type': 'application/json' } }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binaryString = '';
      uint8Array.forEach((byte) => { binaryString += String.fromCharCode(byte); });
      const logdata = btoa(binaryString);

      const password = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      const key = generateRandomString(4);
      const storageKey = `${key}#${password}`;

      await XBSKV.put(storageKey, JSON.stringify(generateStorageData(logdata, name)));

      const responsePayload = { url: `${FRONTEND_URL}?key=${key}#${password}` };

      return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: { ...getCorsHeaders(FRONTEND_URL, 'PUT, OPTIONS'), 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Upload error:', error);
      return new Response(error.stack || 'Internal Server Error', { status: 500 });
    }
  }

  // --- 路由2: 读取日志 ---
  if (pathname.endsWith('/api/dice/load_data') && request.method === 'GET') {
    try {
      const key = searchParams.get("key");
      const password = searchParams.get("password");

      if (!key || !password) {
        return new Response(JSON.stringify({ error: "Missing key or password" }), {
          status: 400,
          headers: { ...getCorsHeaders(FRONTEND_URL, 'GET, OPTIONS'), 'Content-Type': 'application/json' },
        });
      }

      const storageKey = `${key}#${password}`;
      const storedData = await XBSKV.get(storageKey);

      if (storedData === null) {
        return new Response(JSON.stringify({ error: "Data not found" }), {
          status: 404,
          headers: { ...getCorsHeaders(FRONTEND_URL, 'GET, OPTIONS'), 'Content-Type': 'application/json' },
        });
      }

      return new Response(storedData, {
        status: 200,
        headers: { ...getCorsHeaders(FRONTEND_URL, 'GET, OPTIONS'), 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Load data error:', error);
      return new Response(error.stack || 'Internal Server Error', { status: 500 });
    }
  }

  // --- 其他: 返回404 ---
  return new Response('Not Found', { status: 404 });
}