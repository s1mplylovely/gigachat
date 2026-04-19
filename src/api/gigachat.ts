import type {
    GigaChatRequest,
    GigaChatResponse,
    GigaChatStreamDelta,
    GigaChatAuthResponse,
    GigaChatMessage,
    AuthCredentials,
    TokenCache
} from '../types';

const AUTH_URL = '/api/oauth'; // vite.config
const API_BASE = '/api/gigachat';
const TOKEN_REFRESH_BUFFER = 60_000; // мс

let tokenCache: TokenCache | null = null;

export class GigaChatError extends Error {
    constructor(
        message: string,
        public readonly status?: number,
        public readonly code?: string,
    ) {
        super(message);
        this.name = 'GigaChatError';
    }
}

// Получить или обновить токен
export async function getAccessToken(
    credentials: AuthCredentials,
    onToken?: (token: string, expiresAt: number) => void,
): Promise<string> {
    const now = Date.now();
    if (tokenCache && now < tokenCache.expiresAt - TOKEN_REFRESH_BUFFER) {
        return tokenCache.token;
    }

    const rquid = crypto.randomUUID();
    const body = new URLSearchParams({
        scope: credentials.scope,
        grant_type: 'client_credentials',
    });

    const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            RqUID: rquid,
            Authorization: `Basic ${credentials.credentials}`,
        },
        body,
    });
    console.log('REQUEST BODY:', body);

    if (!res.ok) {
        const text = await res.text().catch(() => 'Unknown error');
        throw new GigaChatError(`Auth failed: ${text}`, res.status, 'AUTH_FAILED');
    }

    const data: GigaChatAuthResponse = await res.json();
    tokenCache = { token: data.access_token, expiresAt: data.expires_at };
    onToken?.(data.access_token, data.expires_at);
    return data.access_token;
}

// Получить список доступных моделей — GET /api/v1/models
export async function getModels(token: string): Promise<string[]> {
    const res = await fetch(`${API_BASE}/models`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new GigaChatError(
            `Models API error ${res.status}: ${text}`,
            res.status,
            'API_ERROR',
        );
    }

    const data = await res.json();
    return (data.data ?? []).map((m: { id: string }) => m.id);
}

// Non-streaming request — POST /api/v1/chat/completions
export async function sendMessage(
    messages: GigaChatMessage[],
    token: string,
    options: {
        model: string;
        temperature?: number;
        topP?: number;
        maxTokens?: number;
    },
): Promise<string> {
    const body: GigaChatRequest = {
        model: options.model,
        messages,
        stream: false,
        temperature: options.temperature ?? 1.0,
        top_p: options.topP ?? 0.9,
        max_tokens: options.maxTokens ?? 2048,
    };

    const res = await fetch(`${API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    console.log('REQUEST BODY:', body);

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new GigaChatError(
            `API error ${res.status}: ${text}`,
            res.status,
            'API_ERROR',
        );
    }

    const data: GigaChatResponse = await res.json();
    const content = data.choices[0]?.message?.content;
    if (!content) throw new GigaChatError('Empty response from API', 200, 'EMPTY_RESPONSE');
    return content;
}

// Streaming — POST /api/v1/chat/completions (stream: true)
export function sendMessageStream(
    messages: GigaChatMessage[],
    token: string,
    options: {
        model: string;
        temperature?: number;
        topP?: number;
        maxTokens?: number;
    },
    callbacks: {
        onChunk: (chunk: string) => void;
        onDone: () => void;
        onError: (err: GigaChatError) => void;
    },
): AbortController {
    const controller = new AbortController();

    const body: GigaChatRequest = {
        model: options.model,
        messages,
        stream: true,
        temperature: options.temperature ?? 1.0,
        top_p: options.topP ?? 0.9,
        max_tokens: options.maxTokens ?? 2048,
    };

    (async () => {
        try {
            const res = await fetch(`${API_BASE}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new GigaChatError(`Streaming API error ${res.status}: ${text}`, res.status);
            }
            if (!res.body) throw new GigaChatError('ReadableStream not supported', 0, 'NO_STREAM');

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? ''; // незаконченная строка в буфере

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed === ':') continue;

                    if (trimmed.startsWith('data: ')) {
                        const raw = trimmed.slice(6);
                        if (raw === '[DONE]') {
                            callbacks.onDone();
                            return;
                        }
                        const delta: GigaChatStreamDelta = JSON.parse(raw);
                        const chunk = delta.choices[0]?.delta?.content;
                        if (chunk) callbacks.onChunk(chunk);
                        if (delta.choices[0]?.finish_reason === 'stop') {
                            callbacks.onDone();
                            return;
                        }
                    }
                }
            }
            callbacks.onDone();
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') return; // отмена пользователем
            const gcErr =
                err instanceof GigaChatError
                    ? err
                    : new GigaChatError(
                        err instanceof Error ? err.message : 'Unknown streaming error',
                    );
            callbacks.onError(gcErr);
        }
    })();

    return controller;
}

export function buildMessagesPayload(
    systemPrompt: string | undefined,
    chatMessages: Array<{ role: string; content: string }>,
): GigaChatMessage[] {
    const payload: GigaChatMessage[] = [];
    if (systemPrompt?.trim()) {
        payload.push({ role: 'system', content: systemPrompt });
    }
    for (const m of chatMessages) {
        payload.push({ role: m.role as GigaChatMessage['role'], content: m.content });
    }
    return payload;
}