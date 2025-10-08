// 指定此API路由在Edge运行时中执行
export const runtime = 'edge';

const FRONTEND_URL = 'https://log.loli.band/';

/**
 * 处理日志读取请求
 * @param {Request} request
 */
export default async function handler(request) {
  // 设置CORS响应头
  const corsHeaders = {
    'Access-Control-Allow-Origin': FRONTEND_URL.slice(0, -1),
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept-Version',
  };

  // 处理CORS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 仅允许GET方法
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 检查KV命名空间是否已绑定
  if (!process.env.XBSKV) {
    return new Response('KV_BINDING_ERROR: "XBSKV" is not bound.', { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const password = searchParams.get("password");

    if (!key || !password) {
      return new Response(
        JSON.stringify({ error: "Missing key or password" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const storageKey = `${key}#${password}`;
    
    // 从KV中读取数据
    const storedData = await process.env.XBSKV.get(storageKey);

    if (storedData === null) {
      return new Response(
        JSON.stringify({ error: "Data not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(storedData, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Load data error:', error);
    return new Response(error.stack || 'Internal Server Error', { status: 500 });
  }
}