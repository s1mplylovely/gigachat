import React, { useEffect, useRef, useCallback } from 'react';
import type { Message as MessageType } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from '../ui/EmptyState';
import styles from './MessageList.module.css';

interface MessageListProps {
    messages: MessageType[];
    isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    if (!messages.length && !isTyping) {
        return <EmptyState />;
    }

    return (
        <div className={styles.container}>
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} variant={msg.role} />
            ))}

            {isTyping && <TypingIndicator isVisible />}

            <div ref={bottomRef} />
        </div>
    );
};