import React, { useState, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Sidebar.module.css';
import type { Chat } from '../../types';
import { useStore, useFilteredChats } from '../../utils/storage';
import { DeleteForm } from './DeleteForm';
import { Button } from '../ui/Button';
import { SearchInput } from './SearchInput';
import { ChatList } from './ChatList';
import { Icon } from '../ui/Icon';


interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, onClose, onOpenSettings }) => {
    const navigate = useNavigate();
    const { id: activeChatId } = useParams<{ id: string }>();

    const { createChat, deleteChat, editChat } = useStore();
    const filteredChats = useFilteredChats();

    const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

    const handleNewChat = useCallback(() => {
        const chat = createChat();
        navigate(`/chat/${chat.id}`);
        onClose();
    }, [createChat, navigate, onClose]);

    const handleSelectChat = useCallback(
        (chatId: string) => {
            navigate(`/chat/${chatId}`);
            onClose();
        },
        [navigate, onClose],
    );

    const handleEditChat = useCallback((chatId: string) => {
        const title = window.prompt('Новое название:');
        if (title?.trim()) {
            editChat(chatId, { title: title.trim() });
        }
    },
        [editChat]
    );

    const handleDeleteRequest = useCallback((chatId: string) => {
        const chat = filteredChats.find((c: Chat) => c.id === chatId);
        if (chat) {
            setChatToDelete(chat);
        }
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (!chatToDelete) return;
        deleteChat(chatToDelete.id);
        if (chatToDelete.id === activeChatId) {
            navigate('/', { replace: true });
        }
        setChatToDelete(null);
    }, [chatToDelete, deleteChat, activeChatId, navigate]);

    return (
        <>
            <aside className={clsx(styles.sidebar, { '': isOpen })}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logoRow}>
                        <Icon name='logo' />
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleNewChat}
                        className={styles.newChatBtn}>
                        <Icon name='plus' />
                        Новый чат
                    </Button>

                    {/* Search */}
                    <div className={styles.search}>
                        <SearchInput />
                    </div>
                </div>

                {/* Chat list */}
                <div className={styles.chatList}>
                    <ChatList
                        chats={filteredChats}
                        activeChatId={activeChatId || null}
                        onSelectChat={handleSelectChat}
                        onEditChat={handleEditChat}
                        onDeleteChat={handleDeleteRequest}
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

            <DeleteForm
                chat={chatToDelete}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setChatToDelete(null)}
            />
        </>
    );
});

Sidebar.displayName = 'Sidebar';