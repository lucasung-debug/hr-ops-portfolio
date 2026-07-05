/**
 * Cloudflare Pages Function: /api/sync
 *
 * POST -> GitHub Actions Notion sync workflow dispatch.
 */

const ALLOWED_ORIGIN = 'https://smjportfolio.com';

const CORS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

function bearerToken(request) {
  const authHeader = request.headers.get('Authorization') || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
}

export async function onRequestPost({ request, env }) {
  const token = bearerToken(request);
  if (!env.EDITOR_TOKEN || !token || token !== env.EDITOR_TOKEN) {
    return respond(JSON.stringify({ error: 'Unauthorized' }), 401);
  }

  if (!env.GH_WORKFLOW_TOKEN) {
    return respond(JSON.stringify({ error: 'Server not configured' }), 500);
  }

  // ponytail: v1 has no rate limit; the single operator password gate is the ceiling.
  try {
    const response = await fetch('https://api.github.com/repos/lucasung-debug/hr-ops-portfolio/actions/workflows/sync-notion.yml/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.GH_WORKFLOW_TOKEN,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'hr-ops-portfolio-sync',
      },
      body: JSON.stringify({ ref: 'main' }),
    });

    if (response.status !== 204) {
      return respond(JSON.stringify({ error: 'GitHub dispatch failed' }), 502);
    }

    return respond(JSON.stringify({ ok: true }), 202);
  } catch {
    return respond(JSON.stringify({ error: 'GitHub dispatch failed' }), 502);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { ...CORS, ...SECURITY } });
}
