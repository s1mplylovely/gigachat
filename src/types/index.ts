export type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: string;
    isStreaming?: boolean;
}

export interface Chat {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
    messages: Message[];
    systemPrompt?: string;
}

// Global store
export interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
    // True пока ждет первый chunk (non-stream response)
    isLoading: boolean;
    isStreaming: boolean;
    error: string | null;
    // Текущая debounced sidebar строка поиска
    searchQuery: string;
}

export interface AppState {
    isAuthenticated: boolean;
    activeChatId: string | null;
    isSettingsOpen: boolean;
    isSidebarOpen: boolean;
    isTyping: boolean;
    settings: Settings;
}

// ChatAction
export type ChatAction =
    | { type: 'LOAD_STATE'; payload: ChatState }
    | { type: 'CREATE_CHAT'; payload: Chat }
    | { type: 'DELETE_CHAT'; payload: { chatId: string } }
    | { type: 'SET_ACTIVE_CHAT'; payload: { chatId: string | null } }
    | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
    | { type: 'APPEND_STREAM_CHUNK'; payload: { chatId: string; messageId: string; chunk: string } }
    | { type: 'FINALIZE_STREAM'; payload: { chatId: string; messageId: string } }
    | { type: 'UPDATE_CHAT_TITLE'; payload: { chatId: string; title: string } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_STREAMING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_SEARCH_QUERY'; payload: string };

// API
export interface GigaChatMessage {
    role: MessageRole;
    content: string;
}

export interface GigaChatRequest {
    model: string;
    messages: GigaChatMessage[];
    stream: boolean;
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
}

export interface GigaChatResponseChoice {
    message: GigaChatMessage;
    finish_reason: 'stop' | 'length' | 'content_filter' | null;
    index: number;
}

export interface GigaChatResponse {
    choices: GigaChatResponseChoice[];
    created: number;
    model: string;
    object: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface GigaChatStreamDelta {
    choices: Array<{
        delta: { content?: string; role?: MessageRole };
        finish_reason: string | null;
        index: number;
    }>;
}

export interface GigaChatAuthResponse {
    access_token: string;
    expires_at: number;
}

// Настройки
export type GigaChatModel =
    | 'GigaChat'
    | 'GigaChat-Plus'
    | 'GigaChat-Pro'
    | 'GigaChat-Max';

export interface Settings {
    model: GigaChatModel;
    temperature: number;
    topP: number;
    maxTokens: number;
    systemPrompt: string;
    theme: 'light' | 'dark';
    streamingEnabled: boolean;
}

// Аутентификация
export type ScopeType =
    | 'GIGACHAT_API_PERS'
    | 'GIGACHAT_API_B2B'
    | 'GIGACHAT_API_CORP';

export interface AuthCredentials {
    credentials: string;
    scope: ScopeType;
}

export interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    tokenExpiresAt: number | null;
    credentials: AuthCredentials | null;
}

export interface TokenCache {
    token: string;
    expiresAt: number;
}

// Icons
export interface IconProps {
    name: IconName;
    size?: number;
}

export type IconName =
    | 'attach' | 'send' | 'stop' | 'close' | 'burger' | 'checkmark'
    | 'copy' | 'message' | 'edit' | 'delete' | 'search' | 'plus'
    | 'user' | 'settings' | 'error' | 'assistant' | 'logo';