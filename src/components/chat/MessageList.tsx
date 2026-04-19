import React, { useEffect, useRef, memo } from 'react';
import type { Message as MessageType } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from '../ui/EmptyState';
import styles from './MessageList.module.css';

const AUTO_SCROLL_HEIGHT = 120; // px

interface MessageListProps {
    messages: MessageType[];
    // True когда ждет первый токен (non-streaming)
    isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = memo(({ messages, isTyping }) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Авто прокрутка
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        // Авто прокрутка только если пользователь в пределах x пикселей от нижней части экрана
        const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        if (distFromBottom < AUTO_SCROLL_HEIGHT) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    });

    const visibleMessages = messages.filter((m) => m.role !== 'system');

    if (visibleMessages.length === 0 && !isTyping) {
        return <EmptyState />;
    }

    return (
        <div className={styles.container} ref={listRef}>
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={bottomRef} />
        </div>
    );
});

MessageList.displayName = 'MessageList';