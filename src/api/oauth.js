// Vercel Serverless Function

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const credentials = process.env.GIGACHAT_CREDENTIALS;
  const scope = process.env.GIGACHAT_SCOPE ?? 'GIGACHAT_API_PERS';

  if (!credentials) {
    console.error('[api/oauth] GIGACHAT_CREDENTIALS env var is not set');
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: missing credentials' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const rquid = crypto.randomUUID();
  const body = new URLSearchParams({
    scope,
    grant_type: 'client_credentials',
  });

  try {
    const upstream = await fetch(
      'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          RqUID: rquid,
          Authorization: `Basic ${credentials}`,
        },
        body,
      },
    );

    const data = await upstream.text();

    return new Response(data, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[api/oauth] Upstream error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to reach GigaChat auth service' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
