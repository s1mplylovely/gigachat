import React, { useState, useRef, useEffect, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import clsx from 'clsx';
import 'highlight.js/styles/github-dark.css';

import styles from './Message.module.css';
import type { Message as MessageType } from '../../types';
import { Icon } from '../ui/Icon';

interface MessageProps {
    message: MessageType;
}

export const Message: React.FC<MessageProps> = memo(({ message }) => {
    const isUser = message.role === 'user';
    const contentRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);

        timeoutRef.current = setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div
            className={clsx(styles.wrapper, isUser ? styles.user : styles.assistant)}
        >
            {!isUser && <Icon name='assistant' />}

            <div className={styles.bubbleContainer}>
                {/* Роль */}
                <div
                    className={clsx(styles.label, isUser ? styles.labelUser : styles.labelAssistant)}>
                    {isUser ? 'Вы' : 'GigaChat'}
                </div>
                {/* Контент */}
                <div
                    className={clsx(styles.bubble, isUser ? styles.bubbleUser : styles.bubble)}>
                    <div
                        ref={contentRef}
                        className="markdown-content">
                        <ReactMarkdown
                            rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>
                <div
                    className={clsx(styles.footer, isUser ? styles.footerUser : styles.footerAssistant)}>
                    {/* Копировать */}
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
});

Message.displayName = 'Message';