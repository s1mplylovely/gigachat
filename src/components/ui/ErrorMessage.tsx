import React from 'react';
import styles from './ErrorMessage.module.css';
import { Icon } from './Icon';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div role="alert" className={styles.container}>
            <Icon name='error' />
            <span className={styles.text}>{message}</span>
        </div>
    );
};