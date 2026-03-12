import type { Chat, Settings } from '../types';

export const mockChats: Chat[] = [
    {
        id: '1',
        title: 'Анализ данных в Python',
        lastMessageDate: new Date('2026-03-10T14:30:00'),
        isActive: true,
        messages: []
    }]

export const defaultSettings: Settings = {
    theme: 'dark',
};