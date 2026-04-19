import React from 'react';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
    Chat,
    ChatState,
    Message,
    Settings,
    AuthState,
    AuthCredentials,
} from '../types';

const nowISO = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

const TOKEN_REFRESH_BUFFER = 60_000;

export const generateChatTitle = (firstMessage?: string): string => {
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 35;
    if (!firstMessage || firstMessage.trim().length < MIN_LENGTH) return 'Новый диалог';
    const trimmed = firstMessage.trim();
    return trimmed.length > MAX_LENGTH ? trimmed.slice(0, MAX_LENGTH).trimEnd() + '…' : trimmed;
}

// Chat slice
interface ChatSlice extends ChatState {
    createChat: (firstUserMessage?: string) => Chat;
    deleteChat: (chatId: string) => void;
    editChat: (chatId: string, updates: Partial<Chat>) => void;
    setActiveChat: (chatId: string | null) => void;
    addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message;
    appendStreamChunk: (chatId: string, messageId: string, chunk: string) => void;
    finalizeStream: (chatId: string, messageId: string) => void;
    updateChatTitle: (chatId: string, title: string) => void;
    setLoading: (v: boolean) => void;
    setStreaming: (v: boolean) => void;
    setError: (e: string | null) => void;
    setSearchQuery: (q: string) => void;
    // computed (не stored, inline)
    getActiveChat: () => Chat | null;
    getFilteredChats: () => Chat[];
}

const createChatSlice = (set: any, get: any): ChatSlice => ({
    chats: [],
    activeChatId: null,
    isLoading: false,
    isStreaming: false,
    error: null,
    searchQuery: '',

    createChat: (firstUserMessage?: string): Chat => {
        const chat: Chat = {
            id: uuid(),
            title: generateChatTitle(firstUserMessage),
            createdAt: nowISO(),
            updatedAt: nowISO(),
            messages: [],
        };
        set((s: ChatSlice) => {
            s.chats.unshift(chat);
            s.activeChatId = chat.id;
        });
        return chat;
    },

    deleteChat: (chatId: string) => {
        set((s: ChatSlice) => {
            s.chats = s.chats.filter((c: Chat) => c.id !== chatId);
            if (s.activeChatId === chatId) s.activeChatId = null;
        });
    },

    editChat: (chatId: string, updates: Partial<Chat>) =>
        set((s: ChatSlice) => ({
            chats: s.chats.map((chat) =>
                chat.id === chatId ? { ...chat, ...updates } : chat),
        })),

    setActiveChat: (chatId: string | null) => {
        set((s: ChatSlice) => { s.activeChatId = chatId; });
    },

    addMessage: (
        chatId: string,
        partial: Omit<Message, 'id' | 'timestamp'>,
    ): Message => {
        const message: Message = {
            ...partial,
            id: uuid(),
            timestamp: nowISO(),
        };
        set((s: ChatSlice) => {
            const chat = s.chats.find((c: Chat) => c.id === chatId);
            if (chat) {
                chat.messages.push(message);
                chat.updatedAt = nowISO();
            }
        });
        return message;
    },

    appendStreamChunk: (chatId: string, messageId: string, chunk: string) => {
        set((s: ChatSlice) => {
            const chat = s.chats.find((c: Chat) => c.id === chatId);
            if (!chat) return;
            const msg = chat.messages.find((m: Message) => m.id === messageId);
            if (msg) msg.content += chunk;
        });
    },

    finalizeStream: (chatId: string, messageId: string) => {
        set((s: ChatSlice) => {
            const chat = s.chats.find((c: Chat) => c.id === chatId);
            if (!chat) return;
            const msg = chat.messages.find((m: Message) => m.id === messageId);
            if (msg) msg.isStreaming = false;
            chat.updatedAt = nowISO();
        });
    },

    updateChatTitle: (chatId: string, title: string) => {
        set((s: ChatSlice) => {
            const chat = s.chats.find((c: Chat) => c.id === chatId);
            if (chat) chat.title = title;
        });
    },

    setLoading: (v: boolean) => set((s: ChatSlice) => { s.isLoading = v; }),
    setStreaming: (v: boolean) => set((s: ChatSlice) => { s.isStreaming = v; }),
    setError: (e: string | null) => set((s: ChatSlice) => { s.error = e; }),
    setSearchQuery: (q: string) => set((s: ChatSlice) => { s.searchQuery = q; }),

    getActiveChat: (): Chat | null => {
        const { chats, activeChatId } = get();
        return chats.find((c: Chat) => c.id === activeChatId) ?? null;
    },

    getFilteredChats: (): Chat[] => {
        const { chats, searchQuery } = get();
        if (!searchQuery.trim()) return chats;
        const q = searchQuery.toLowerCase();
        return chats.filter(
            (c: Chat) =>
                c.title.toLowerCase().includes(q) ||
                c.messages.at(-1)?.content.toLowerCase().includes(q),
        );
    },
});

// Settings
interface SettingsSlice {
    settings: Settings;
    updateSettings: (patch: Partial<Settings>) => void;
    resetSettings: () => void;
}

const DEFAULT_SETTINGS: Settings = {
    model: 'GigaChat',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 32768,
    systemPrompt: 'Отвечай на русском языке кратко и точно',
    theme: 'dark',
    streamingEnabled: true,
};

const createSettingsSlice = (set: any): SettingsSlice => ({
    settings: DEFAULT_SETTINGS,

    updateSettings: (patch: Partial<Settings>) => {
        set((s: SettingsSlice) => { Object.assign(s.settings, patch); });
    },

    resetSettings: () => {
        set((s: SettingsSlice) => { s.settings = DEFAULT_SETTINGS; });
    },
});

// Auth
interface AuthSlice {
    authState: AuthState;
    login: (credentials: AuthCredentials) => void;
    logout: () => void;
    setToken: (token: string, expiresAt: number) => void;
    isTokenValid: () => boolean;
}

const createAuthSlice = (set: any, get: any): AuthSlice => ({
    authState: {
        isAuthenticated: false,
        accessToken: null,
        tokenExpiresAt: null,
        credentials: null,
    },

    login: (credentials: AuthCredentials) => {
        set((s: AuthSlice) => {
            s.authState.credentials = credentials;
            s.authState.isAuthenticated = true;
        });
    },

    logout: () => {
        set((s: AuthSlice) => {
            s.authState = {
                isAuthenticated: false,
                accessToken: null,
                tokenExpiresAt: null,
                credentials: null,
            };
        });
    },

    setToken: (token: string, expiresAt: number) => {
        set((s: AuthSlice) => {
            s.authState.accessToken = token;
            s.authState.tokenExpiresAt = expiresAt;
        });
    },

    isTokenValid: (): boolean => {
        const { authState } = get();
        if (!authState.accessToken || !authState.tokenExpiresAt) return false;
        return Date.now() < authState.tokenExpiresAt - TOKEN_REFRESH_BUFFER;
    }
});

export type RootStore = ChatSlice & SettingsSlice & AuthSlice;

export const useStore = create<RootStore>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set: any, get: any) => ({
                    ...createChatSlice(set, get),
                    ...createSettingsSlice(set),
                    ...createAuthSlice(set, get),
                })),
            ),
            {
                name: 'gigachat-store',
                version: 1,
                partialize: (state: ChatSlice & SettingsSlice & AuthSlice) => ({
                    chats: state.chats,
                    activeChatId: state.activeChatId,
                    settings: state.settings,
                    auth: {
                        isAuthenticated: state.authState.isAuthenticated,
                        credentials: state.authState.credentials,
                        accessToken: null,
                        tokenExpiresAt: null,
                    },
                }),
                merge: (persisted, current) => {
                    const p = persisted as Partial<RootStore>;
                    try {
                        return {
                            ...current,
                            ...p,
                            settings: {
                                ...current.settings,
                                ...p?.settings,
                            },
                        };
                    } catch {
                        console.warn('[store] Failed to merge persisted state, using defaults');
                        return current;
                    }
                },
            }
        ),
        { name: 'GigaChatStore' }
    )
);

export const useChats = () => useStore((s) => s.chats);
export const useActiveChat = () => useStore((s) => s.getActiveChat());
export const useActiveChatId = () => useStore((s) => s.activeChatId);
export const useIsLoading = () => useStore((s) => s.isLoading);
export const useIsStreaming = () => useStore((s) => s.isStreaming);
export const useError = () => useStore((s) => s.error);
export const useSearchQuery = () => useStore((s) => s.searchQuery);
export const useSettings = () => useStore((s) => s.settings);
export const useAuth = () => useStore((s) => s.authState);
export const useIsAuthenticated = () => useStore((s) => s.authState.isAuthenticated);
export const useFilteredChats = () => {
    const chats = useStore((s) => s.chats);
    const searchQuery = useStore((s) => s.searchQuery);

    return React.useMemo(() => {
        if (!searchQuery.trim()) return chats;

        const q = searchQuery.toLowerCase();
        return chats.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.messages.at(-1)?.content.toLowerCase().includes(q),
        );
    }, [chats, searchQuery]);
};