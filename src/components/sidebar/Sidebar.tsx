import React from 'react';
import styles from './Sidebar.module.css';
import logo from '../../data/gigachat-horizontal-logo.svg';
import { Button } from '../ui/Button';

interface SidebarProps {
    onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    onNewChat,
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
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" /> // плюс
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Новый чат
                </Button>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <div className={styles.avatar}>
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-muted)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /> // иконка пользователя
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>Пользователь</div>
                </div>
            </div>
        </aside >
    );
};