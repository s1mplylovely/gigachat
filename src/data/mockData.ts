import type { Chat, Settings } from '../types';

export const mockChats: Chat[] = [
    {
        id: '1',
        title: 'Анализ данных в Python',
        lastMessageDate: new Date('2026-03-10T14:30:00'),
        isActive: true,
        messages: []
    },
    {
        id: '2',
        title: 'Рецепт блинов',
        lastMessageDate: new Date('2026-03-10T14:30:00'),
        isActive: false,
        messages: [],
    },
    {
        id: '3',
        title: 'Перевод текста',
        lastMessageDate: new Date('2026-03-10T14:30:00'),
        isActive: false,
        messages: [],
    },
    {
        id: '4',
        title: 'Составление резюме',
        lastMessageDate: new Date('2026-03-10T14:30:00'),
        isActive: false,
        messages: [],
    },
    {
        id: '5',
        title: 'Объяснение фильма Интерстеллар',
        lastMessageDate: new Date('2026-03-10T14:30:00'),
        isActive: false,
        messages: [],
    },
    {
        id: '6',
        title: 'Породы домашних кошек',
        lastMessageDate: new Date('2026-03-10T14:30:00'),
        isActive: false,
        messages: [],
    },
]

export const defaultSettings: Settings = {
    model: "GigaChat",
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 4096,
    systemPrompt: "",
    theme: "dark",
};