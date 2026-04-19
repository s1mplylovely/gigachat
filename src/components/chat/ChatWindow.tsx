import React, { useCallback } from 'react'
import { useOutletContext } from 'react-router-dom';
import { useStore } from '../../utils/storage';
import type { RootStore } from '../../utils/storage';
import { useSendMessage } from '../../hooks/useSendMessage';
import styles from './ChatWindow.module.css'
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Icon } from '../ui/Icon';

interface OutletContext {
    onToggleSidebar: () => void;
}

interface ChatWindowProps {
    chatId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
    const { onToggleSidebar } = useOutletContext<OutletContext>();
    const { send, stopGeneration } = useSendMessage();

    const chat = useStore((s: RootStore) => s.chats.find((c) => c.id === chatId));
    const isLoading = useStore((s: RootStore) => s.isLoading);
    const isStreaming = useStore((s: RootStore) => s.isStreaming);
    const error = useStore((s: RootStore) => s.error);

    const handleSend = useCallback((text: string) => { send(chatId, text); },
        [chatId, send],
    );

    if (!chat) return null;

    return (
        <div className={styles.container}>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.left}>

                    {/* Кнопка-бургер */}
                    <button
                        onClick={onToggleSidebar}
                        className={styles.burger}
                        aria-label="Открыть меню"
                    >
                        <Icon name='burger' />
                    </button>
                </div>

                {/* Заголовок чата */}
                <div className={styles.titleBlock}>
                    <div className={styles.title}>{chat.title}</div>
                </div>
            </header>

            {/* Ошибка*/}
            {error && (
                <div className={styles.error}>
                    <ErrorMessage message={error} style={styles.errorContainer} />
                    <button
                        className={styles.errorClose}
                        onClick={() => useStore.getState().setError(null)}
                        aria-label="Закрыть"
                    >×</button>
                </div>
            )}

            {/* Сообщения */}
            <MessageList messages={chat.messages} isTyping={isLoading && !isStreaming} />

            {/* Поле ввода */}
            <InputArea
                onSend={handleSend}
                onStop={stopGeneration}
                isLoading={isLoading}
                isStreaming={isStreaming}
            />
        </div>
    )
}

ChatWindow.displayName = 'ChatWindow';