import React, { useState, useRef, useLayoutEffect, useCallback, memo } from 'react';
import clsx from 'clsx';
import styles from './InputArea.module.css';
import { Icon } from '../ui/Icon';

interface InputAreaProps {
    onSend: (text: string) => void;
    onStop: () => void;
    isLoading: boolean;
    isStreaming: boolean;
}

const MAX_ROWS = 5;
const LINE_HEIGHT = 22; // px
const BASE_OFFSET = 24;

export const InputArea: React.FC<InputAreaProps> = memo(({
    onSend, onStop, isLoading, isStreaming
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
        if (!trimmed || isLoading || isStreaming) return;

        onSend(trimmed);
        setValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    }, [value, isLoading, isStreaming, onSend]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const canSend = value.trim().length > 0 && !isLoading && !isStreaming;
    const isActive = isLoading || isStreaming;

    return (
        <div className={styles.wrapper}>
            <div className={styles.inputContainer}>
                {/* Изображение */}
                <button
                    className={styles.attachButton}
                    title="Прикрепить изображение"
                    type="button"
                    disabled>
                    <Icon name='attach' size={20} />
                </button>

                {/* Поле ввода */}
                <textarea
                    ref={textareaRef}
                    className={styles.textarea}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите сообщение..."
                    rows={1}
                    aria-label="Поле ввода сообщения"
                    disabled={isActive}
                />

                {isActive ? (
                    <button
                        onClick={onStop}
                        className={styles.stopButton}
                        title="Остановить генерацию"
                        aria-label="Остановить"
                        type="button">
                        <Icon name='stop' />
                    </button>
                ) : (
                    <button
                        onClick={handleSend}
                        disabled={!canSend}
                        className={clsx(
                            styles.sendButton,
                            canSend ? styles.sendButtonActive : styles.sendButtonDisabled
                        )}
                        title="Отправить"
                        aria-label="Отправить"
                        type="button">
                        <Icon name='send' />
                    </button>
                )}
            </div>
        </div>
    );
});

InputArea.displayName = 'InputArea';