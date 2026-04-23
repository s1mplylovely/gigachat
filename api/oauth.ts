import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });
const BASE = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, RqUID');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const credentials = process.env.GIGACHAT_CREDENTIALS;
  const authHeader = credentials
    ? `Basic ${credentials}`
    : (req.headers['authorization'] as string) ?? '';

  const rquid =
    (req.headers['rquid'] as string) ||
    (req.headers['rquid'] as string) ||
    crypto.randomUUID();

  let bodyStr: string;
  if (typeof req.body === 'string') {
    bodyStr = req.body;
  } else if (req.body && typeof req.body === 'object') {
    bodyStr = new URLSearchParams(req.body as Record<string, string>).toString();
  } else {
    bodyStr = '';
  }

  console.log('[oauth] rquid:', rquid);
  console.log('[oauth] authHeader starts with Basic:', authHeader.startsWith('Basic '));
  console.log('[oauth] body:', bodyStr);

  let upstream;
  try {
    upstream = await fetch(BASE, {
      method: 'POST',
      agent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        RqUID: rquid,
        Authorization: authHeader,
      },
      body: bodyStr,
    });
  } catch (err) {
    console.error('[oauth proxy] fetch error:', err);
    return res.status(502).json({ error: 'Bad Gateway', details: String(err) });
  }

  const text = await upstream.text();
  console.log('[oauth] upstream status:', upstream.status, 'body:', text.slice(0, 300));

  try {
    const data = JSON.parse(text);
    return res.status(upstream.status).json(data);
  } catch {
    return res.status(upstream.status).send(text);
  }
}