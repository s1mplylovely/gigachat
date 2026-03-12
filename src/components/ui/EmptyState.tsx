import React from 'react';
import styles from './EmptyState.module.css';

export const EmptyState: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="9" y1="10" x2="15" y2="10" />
                    <line x1="12" y1="7" x2="12" y2="13" />
                </svg>
            </div>

            <div className={styles.textBlock}>
                <p className={styles.title}>
                    Начните новый диалог
                </p>
            </div>
        </div>
    );
};