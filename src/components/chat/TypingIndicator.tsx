import { memo } from 'react';
import styles from './TypingIndicator.module.css';
import logo from '../../data/gigachat-sign-logo.svg';

interface TypingIndicatorProps {
    isVisible: boolean;
    className?: string;
}

export const TypingIndicator = memo<TypingIndicatorProps>(
    ({ isVisible, className }) => {
        if (!isVisible) return null;

        return (
            <div className={`${styles.wrapper} ${className ?? ''}`}>
                <div className={styles.avatar}>
                    <img src={logo} alt="Logo" />
                </div>

                <div className={styles.bubble}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </div>
            </div>
        );
    }
);