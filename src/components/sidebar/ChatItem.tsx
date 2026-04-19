import React, { memo } from 'react';
import clsx from 'clsx';
import type { Chat } from '../../types'
import styles from './ChatItem.module.css'
import { Icon } from '../ui/Icon';

interface ChatItemProps {
    chat: Chat;
    isActive: boolean;
    onSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

function formatDate(date: string): string { //iso
    const MS_IN_DAY = 86400000;
    const d = new Date(date);
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / MS_IN_DAY)
    if (days === 0) return d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Вчера';
    if (days < 7) return d.toLocaleDateString('ru', { weekday: 'short' });
    return d.toLocaleDateString('ru', { day: 'numeric', month: 'short' });
}

export const ChatItem: React.FC<ChatItemProps> = memo(
    ({
        chat,
        isActive,
        onSelect,
        onEdit,
        onDelete,
    }) => {
        return (
            <div
                className={clsx(styles.chatItem, { [styles.active]: isActive })}
                onClick={() => onSelect(chat.id)}
            >
                <div className={styles.messageIcon}>
                    <Icon name='message' />
                </div>

                <div className={styles.text}>
                    <div className={styles.title}>{chat.title}</div>
                    <div className={styles.date}>{formatDate(chat.updatedAt)}</div>
                </div>

                {/* Удалить, переименовать */}
                <div
                    className={styles.actions}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className={styles.editBtn}
                        onClick={() => onEdit(chat.id)}
                        title="Редактировать">
                        <Icon name='edit' />
                    </button>
                    <button
                        className={styles.deleteBtn}
                        onClick={() => onDelete(chat.id)}
                        title="Удалить">
                        <Icon name='delete' />
                    </button>
                </div>
            </div>
        );
    },
);

ChatItem.displayName = 'ChatItem';