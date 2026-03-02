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

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestGet({ env }) {
  try {
    const content = await env.PORTFOLIO_KV.get('portfolio_content');
    return new Response(content || 'null', {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (e) {
    return new Response('null', {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export async function onRequestPut({ request, env }) {
  // EDITOR_TOKEN 인증
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!env.EDITOR_TOKEN || !token || token !== env.EDITOR_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  try {
    const body = await request.text();
    // 유효한 JSON인지 검증
    JSON.parse(body);
    await env.PORTFOLIO_KV.put('portfolio_content', body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON or KV error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
