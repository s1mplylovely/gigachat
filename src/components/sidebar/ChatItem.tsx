import React from 'react'
import type { Chat } from '../../types'
import styles from './ChatItem.module.css'

interface ChatItemProps {
    chat: Chat
    isActive: boolean
    onSelect: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

function formatDate(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / 86400000)

    if (days === 0) {
        return date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
    }

    if (days === 1) return 'Вчера'

    if (days < 7) {
        return date.toLocaleDateString('ru', { weekday: 'short' })
    }

    return date.toLocaleDateString('ru', {
        day: 'numeric',
        month: 'short',
    })
}

export const ChatItem: React.FC<ChatItemProps> = ({
    chat,
    isActive,
    onSelect,
    onEdit,
    onDelete,
}) => {
    return (
        <div
            className={`${styles.chatItem} ${isActive ? styles.active : ''}`}
            onClick={() => onSelect(chat.id)}
        >
            <div className={styles.icon}>
                <svg viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </div>

            <div className={styles.text}>
                <div className={styles.title}>{chat.title}</div>
                <div className={styles.date}>{formatDate(chat.lastMessageDate)}</div>
            </div>

            <div
                className={styles.actions}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={styles.editBtn}
                    onClick={() => onEdit(chat.id)}
                    title="Редактировать"
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </button>

                <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(chat.id)}
                    title="Удалить"
                >
                    <svg viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </button>
            </div>
        </div>
    )
}