import { memo } from 'react';
import styles from './TypingIndicator.module.css';

export const TypingIndicator = memo(() => (
    <div className={styles.wrapper}>
        <div className={styles.bubble}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
        </div>
    </div>
));

TypingIndicator.displayName = 'TypingIndicator';