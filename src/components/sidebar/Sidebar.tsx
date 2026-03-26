import React from 'react';
import type { Chat } from '../../types';
import styles from './Sidebar.module.css';
import logo from '../../data/gigachat-horizontal-logo.svg';
import { Button } from '../ui/Button';
import { SearchInput } from './SearchInput';
import { ChatList } from './ChatList';

interface SidebarProps {
    chats: Chat[];
    activeChatId: string | null;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onEditChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onSearch: (query: string) => void;
    onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    chats,
    activeChatId,
    onNewChat,
    onSelectChat,
    onEditChat,
    onDeleteChat,
    onSearch,
    onOpenSettings
}) => {
    return (
        <aside className={styles.sidebar}>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.logoRow}>
                    <div className={styles.logoIcon}>
                        <img src={logo} alt="Logo" />
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="md"
                    onClick={onNewChat}
                    className={styles.newChatBtn}
                >
                    <svg className={styles.newChatIcon} viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Новый чат
                </Button>

                {/* Search */}
                <div className={styles.search}>
                    <SearchInput onSearch={onSearch} />
                </div>
            </div>

            {/* Chat list */}
            <div className={styles.chatList}>
                <ChatList
                    chats={chats}
                    activeChatId={activeChatId}
                    onSelectChat={onSelectChat}
                    onEditChat={onEditChat}
                    onDeleteChat={onDeleteChat}
                />
            </div>

            {/* Footer */}
            <div className={styles.footer}>

                {/* Пользователь */}
                <div className={styles.avatar}>
                    <svg className={styles.userIcon} viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>Пользователь</div>
                </div>

                {/* Настройки */}
                <button
                    onClick={onOpenSettings}
                    title="Настройки"
                    className={styles.settings}
                >
                    <svg className={styles.settingsIcon} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33
             1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4
             a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06
             A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3
             a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9
             a1.65 1.65 0 0 0-.33-1.82l-.06-.06
             a2 2 0 0 1 2.83-2.83l.06.06
             A1.65 1.65 0 0 0 9 4.68
             a1.65 1.65 0 0 0 1-1.51V3
             a2 2 0 0 1 4 0v.09
             a1.65 1.65 0 0 0 1 1.51
             a1.65 1.65 0 0 0 1.82-.33l.06-.06
             a2 2 0 0 1 2.83 2.83l-.06.06
             A1.65 1.65 0 0 0 19.4 9
             a1.65 1.65 0 0 0 1.51 1H21
             a2 2 0 0 1 0 4h-.09
             a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </button>
            </div>
        </aside>
    );
};