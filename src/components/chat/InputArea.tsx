import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import styles from './InputArea.module.css';

interface InputAreaProps {
    onSend: (text: string) => void;
    onStop: () => void;
    isGenerating?: boolean;
}

const MAX_ROWS = 5;
const LINE_HEIGHT = 22;
const BASE_OFFSET = 24;

export const InputArea: React.FC<InputAreaProps> = ({
    onSend,
    onStop,
    isGenerating = false,
}) => {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = 'auto';
        el.style.height = `${Math.min(
            el.scrollHeight,
            LINE_HEIGHT * MAX_ROWS + BASE_OFFSET
        )}px`;
    }, [value]);

    const handleSend = useCallback(() => {
        const trimmed = value.trim();
        if (!trimmed) return;

        onSend(trimmed);
        setValue('');
    }, [value, onSend]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const canSend = value.trim().length > 0;

    return (
        <div className={styles.wrapper}>
            <div className={styles.inputContainer}>
                {/* Изображение */}
                <button className={styles.attachButton}
                    title="Прикрепить изображение"
                    type="button">
                    <svg viewBox="0 0 20 20" fill="none">
                        <path d="M17 11l-5 5a5 5 0 01-7.07-7.07l7-7a3 3 0 014.24 4.24L9 13.5a1 1 0 01-1.41-1.41L14 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Поле ввода */}
                <textarea
                    ref={textareaRef}
                    className={styles.textarea}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите сообщение... (Enter — отправить, Shift+Enter — новая строка)"
                    rows={1}
                />

                {isGenerating ? (
                    <button
                        onClick={onStop}
                        className={styles.stopButton}
                        title="Остановить генерацию"
                        type="button"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--error)">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={handleSend}
                        disabled={!canSend}
                        className={`${styles.sendButton} ${canSend ? styles.sendButtonActive : styles.sendButtonDisabled}`}
                        title="Отправить"
                        type="button"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={canSend ? '#fff' : 'var(--text-muted)'}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};