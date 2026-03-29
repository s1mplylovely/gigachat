import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import styles from './Message.module.css';
import type { Message as MessageType } from '../../types';
import { Icon } from '../ui/Icon';

interface MessageProps {
    message: MessageType;
    variant: 'user' | 'assistant';
}

export const Message: React.FC<MessageProps> = ({ message, variant }) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isUser = variant === 'user';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);

            timeoutRef.current = setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            // pass
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div
            className={clsx(styles.wrapper, isUser ? styles.user : styles.assistant)}>
            {!isUser && <Icon name='assistant' />}

            <div className={styles.bubbleContainer}>
                <div
                    className={clsx(styles.label, isUser ? styles.labelUser : styles.labelAssistant)}>
                    {isUser ? 'Вы' : 'GigaChat'}
                </div>
                <div
                    className={clsx(styles.bubble, isUser ? styles.bubbleUser : styles.bubble)}>
                    <div className="markdown-content">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                </div>

                <div
                    className={clsx(styles.footer, isUser ? styles.footerUser : styles.footerAssistant)}>
                    <button
                        onClick={handleCopy}
                        aria-label="Копировать сообщение"
                        className={clsx(styles.copyButton, copied && styles.copySuccess)}>
                        <Icon name={copied ? 'checkmark' : 'copy'} />
                    </button>
                </div>
            </div>

            {isUser && <div className={styles.spacer} />}
        </div>
    );
};