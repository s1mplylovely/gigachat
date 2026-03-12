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

export interface Settings {
    theme: 'light' | 'dark';
}

export interface AppState {
    activeChatId: string | null;
    isSidebarOpen: boolean;
    isTyping: boolean;
    settings: Settings;
}
