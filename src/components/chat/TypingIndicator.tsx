import { memo } from 'react';
import clsx from 'clsx';
import styles from './TypingIndicator.module.css';
import { Icon } from '../ui/Icon';

interface TypingIndicatorProps {
    isVisible: boolean;
    className?: string;
}

export const TypingIndicator = memo<TypingIndicatorProps>(
    ({ isVisible, className }) => {
        if (!isVisible) return null;

        return (
            <div className={clsx(styles.wrapper, className)}>
                <Icon name='assistant' />

                <div className={styles.bubble}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </div>
            </div>
        );
    }
);