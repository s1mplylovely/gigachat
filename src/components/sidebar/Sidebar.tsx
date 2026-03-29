import React from 'react';
import type { Chat } from '../../types';
import styles from './Sidebar.module.css';
import { Button } from '../ui/Button';
import { SearchInput } from './SearchInput';
import { ChatList } from './ChatList';
import { Icon } from '../ui/Icon';

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
                    <Icon name='logo' />
                </div>

                <Button
                    variant="primary"
                    size="md"
                    onClick={onNewChat}
                    className={styles.newChatBtn}>
                    <Icon name='plus' />
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
                    <Icon name='user' />
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>Пользователь</div>
                </div>

                {/* Настройки */}
                <button
                    onClick={onOpenSettings}
                    title="Настройки"
                    className={styles.settings}>
                    <Icon name='settings' />
                </button>
            </div>
        </aside>
    );
};