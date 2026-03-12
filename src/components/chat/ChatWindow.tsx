import React from 'react'
import type { Chat } from '../../types'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
    chat: Chat | null
    onToggleSidebar: () => void
    isSidebarOpen: boolean
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    chat,
    onToggleSidebar
}) => {
    const title = chat?.title ?? 'GigaChat'

    return (
        <div className={styles.container}>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.left}>

                    {/* Кнопка-бургер */}
                    <button
                        onClick={onToggleSidebar}
                        className={styles.burger}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    {/* Заголовок чата */}
                    <div className={styles.titleBlock}>
                        <div className={styles.title}>{title}</div>
                    </div>
                </div>
            </header>
        </div>
    )
}