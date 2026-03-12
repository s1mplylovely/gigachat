export type MessageRole = 'user' | 'assistant';

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
}

export interface Chat {
    id: string;
    title: string;
    lastMessageDate: Date;
    isActive?: boolean;
    messages: Message[];
}

export type GigaChatModel =
    | 'GigaChat'
    | 'GigaChat-Plus'
    | 'GigaChat-Pro'
    | 'GigaChat-Max';

export type ScopeType =
    | 'GIGACHAT_API_PERS'
    | 'GIGACHAT_API_B2B'
    | 'GIGACHAT_API_CORP';

export interface Settings {
    model: GigaChatModel;
    temperature: number;
    topP: number;
    maxTokens: number;
    systemPrompt: string;
    theme: 'light' | 'dark';
}

export interface AppState {
    activeChatId: string | null;
    isSettingsOpen: boolean;
    isSidebarOpen: boolean;
    isTyping: boolean;
    settings: Settings;
}
