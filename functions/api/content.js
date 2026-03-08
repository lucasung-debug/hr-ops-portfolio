/**
 * Cloudflare Pages Function: /api/content
 *
 * GET  → KV에서 포트폴리오 콘텐츠 반환 (공개)
 * PUT  → KV에 포트폴리오 콘텐츠 저장 (EDITOR_TOKEN 인증 필요)
 *
 * Cloudflare Pages 설정 (1회):
 *  - Settings > Functions > KV namespace bindings: PORTFOLIO_KV
 *  - Settings > Environment variables: EDITOR_TOKEN (비밀 토큰)
 */

const ALLOWED_ORIGIN = 'https://smjportfolio.com';
const MAX_BODY_SIZE = 100 * 1024; // 100KB

const CORS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function respond(body, status, extra = {}) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS, ...SECURITY, ...extra },
  });
}

export async function onRequestGet({ env }) {
  try {
    const content = await env.PORTFOLIO_KV.get('portfolio_content');
    return respond(content || 'null', 200);
  } catch {
    return respond('null', 200);
  }
}

export async function onRequestPut({ request, env }) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!env.EDITOR_TOKEN || !token || token !== env.EDITOR_TOKEN) {
    return respond(JSON.stringify({ error: 'Unauthorized' }), 401);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    return respond(JSON.stringify({ error: 'Content-Type must be application/json' }), 415);
  }

  try {
    const body = await request.text();
    if (body.length > MAX_BODY_SIZE) {
      return respond(JSON.stringify({ error: 'Payload too large' }), 413);
    }
    try {
      JSON.parse(body);
    } catch {
      return respond(JSON.stringify({ error: 'Invalid JSON' }), 400);
    }
    await env.PORTFOLIO_KV.put('portfolio_content', body);
    return respond(JSON.stringify({ ok: true }), 200);
  } catch {
    return respond(JSON.stringify({ error: 'Internal server error' }), 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { ...CORS, ...SECURITY } });
}
