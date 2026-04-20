export const config = {
  runtime: 'edge',
};

const UPSTREAM_BASE = 'https://gigachat.devices.sberbank.ru/api/v1';

export default async function handler(req) {
  const url = new URL(req.url);
  const subPath = url.pathname.replace(/^\/api\/gigachat/, '') || '/';
  const target = `${UPSTREAM_BASE}${subPath}${url.search}`;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: upstream.headers,
    });
  } catch (err) {
    console.error('[api/gigachat] Upstream error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to reach GigaChat API' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
