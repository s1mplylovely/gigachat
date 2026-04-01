import React from 'react';
import styles from './EmptyState.module.css';
import { Icon } from './Icon';

export const EmptyState: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <Icon name='message' size={32} />
            </div>

            <div className={styles.textBlock}>
                <p className={styles.title}>
                    Начните новый диалог
                </p>
            </div>
        </div>
    );
};