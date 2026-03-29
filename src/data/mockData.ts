import type { Chat, Settings } from '../types';

export const mockChats: Chat[] = [
    {
        id: '1',
        title: 'Анализ данных в Python',
        lastMessageDate: new Date('2026-03-10T14:30:00'),
        isActive: true,
        messages: [
            {
                id: 'm1',
                role: 'user',
                content: 'Какая библиотека в Python используется для анализа данных?',
                timestamp: new Date('2025-03-10T14:30:00'),
            },
            {
                id: 'm2',
                role: 'assistant',
                content:
                    `Для анализа данных в **Python** используются разные библиотеки, которые
           решают различные задачи:\n* работу с многомерными массивами\n* анализ 
           структурированных данных\n* визуализацию данных и машинное обучение\n\nНекоторые 
           из них: _NumPy_, _Pandas_, _Matplotlib_ и _Scikit-learn_.`,
                timestamp: new Date('2025-03-10T14:31:00'),
            },
            {
                id: 'm3',
                role: 'user',
                content: 'Как загрузить CSV в Pandas?',
                timestamp: new Date('2025-03-10T14:31:30'),
            },
            {
                id: 'm4',
                role: 'assistant',
                content:
                    'Используй `pd.read_csv()`.\n\n```python\nimport pandas as pd\ndf = pd.read_csv(\'file.csv\')\nprint(df.head())\n```',
                timestamp: new Date('2025-03-10T14:32:00'),
            },
            {
                id: 'm5',
                role: 'user',
                content: 'А как выбрать столбцы? Например, только "name" и "age"',
                timestamp: new Date('2025-03-10T14:32:30'),
            },
            {
                id: 'm6',
                role: 'assistant',
                content:
                    'Выдели по именам `df[["name", "age"]]` или по индексу `df.iloc[:, [0, 1]]`.',
                timestamp: new Date('2025-03-10T14:33:00'),
            },
        ]
    },
    {
        id: '2',
        title: 'Рецепт блинов',
        lastMessageDate: new Date('2026-03-09T14:30:00'),
        isActive: false,
        messages: [],
    },
    {
        id: '3',
        title: 'Перевод текста',
        lastMessageDate: new Date('2026-03-05T14:30:00'),
        isActive: false,
        messages: [],
    },
    {
        id: '4',
        title: 'Составление резюме',
        lastMessageDate: new Date('2026-03-01T14:30:00'),
        isActive: false,
        messages: [],
    },
    {
        id: '5',
        title: 'Объяснение фильма Интерстеллар',
        lastMessageDate: new Date('2026-02-20T14:30:00'),
        isActive: false,
        messages: [],
    },
    {
        id: '6',
        title: 'Породы домашних кошек',
        lastMessageDate: new Date('2026-02-01T14:30:00'),
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