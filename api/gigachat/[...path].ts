import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });
const BASE = 'https://gigachat.devices.sberbank.ru/api/v1';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const pathSegments = Array.isArray(req.query.path)
        ? req.query.path
        : req.query.path
            ? [req.query.path]
            : [];

    if (pathSegments.length === 0) {
        return res.status(400).json({ error: 'Missing path' });
    }

    const upstreamUrl = `${BASE}/${pathSegments.join('/')}`;

    const bodyStr =
        req.method !== 'GET' && req.method !== 'HEAD'
            ? typeof req.body === 'string'
                ? req.body
                : JSON.stringify(req.body)
            : undefined;

    const isStream = (() => {
        try {
            const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            return parsed?.stream === true;
        } catch {
            return false;
        }
    })();

    const authHeader = req.headers['authorization'] as string ?? '';

    console.log(`[gigachat proxy] ${req.method} ${upstreamUrl}`, { isStream });
    console.log('[gigachat proxy] auth type:', authHeader.split(' ')[0] ?? 'none');

    let upstream;
    try {
        upstream = await fetch(upstreamUrl, {
            method: req.method,
            agent,
            headers: {
                'Content-Type': 'application/json',
                Accept: isStream ? 'text/event-stream' : 'application/json',
                Authorization: authHeader,
            },
            body: bodyStr,
        });
    } catch (err) {
        console.error('[gigachat proxy] fetch error:', err);
        return res.status(502).json({ error: 'Bad Gateway', details: String(err) });
    }

    console.log(`[gigachat proxy] upstream status: ${upstream.status}`);

    if (upstream.status === 401) {
        const text = await upstream.text();
        console.error('[gigachat proxy] 401 body:', text.slice(0, 300));
        return res.status(401).json({ error: 'Unauthorized', details: text });
    }

    res.status(upstream.status);

    if (isStream && upstream.body) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        upstream.body.pipe(res);
        return;
    }

    const data = await upstream.json();
    return res.json(data);
}