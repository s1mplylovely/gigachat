import React, { useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = 'Поиск чатов...',
    onSearch,
    className,
}) => {
    const [value, setValue] = useState('');

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value;

            setValue(query);
            onSearch?.(query);
        },
        [onSearch]
    );

    return (
        <div className={`${styles.wrapper} ${className ?? ''}`}>
            <svg
                className={styles.icon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.input}
            />
        </div>
    );
};