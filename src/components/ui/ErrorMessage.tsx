import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div role="alert" className={styles.container}>
            <svg
                className={styles.icon}
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            <span className={styles.text}>{message}</span>
        </div>
    );
};