import React from 'react';
import type { Chat } from '../../types';
import { ChatItem } from './ChatItem';
import styles from './ChatList.module.css';

interface ChatListProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
    onEditChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    onEditChat,
    onDeleteChat,
}) => {
    if (!chats.length) {
        return <EmptyState />;
    }

    return (
        <div className={styles.list}>
            {chats.map((chat, index) => (
                <div
                    key={chat.id}
                    className={styles.item}
                    style={{ animationDelay: `${index * 0.04}s` }}
                >
                    <ChatItem
                        chat={chat}
                        isActive={chat.id === activeChatId}
                        onSelect={onSelectChat}
                        onEdit={onEditChat}
                        onDelete={onDeleteChat}
                    />
                </div>
            ))}
        </div>
    );
};

const EmptyState = () => (
    <div className={styles.empty}>
        Нет диалогов
    </div>
);