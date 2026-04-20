import React, { useEffect, useRef, memo } from 'react';
import type { Message as MessageType } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from '../ui/EmptyState';
import styles from './MessageList.module.css';

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
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

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