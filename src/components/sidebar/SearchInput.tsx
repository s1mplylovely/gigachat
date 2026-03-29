import React, { useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import clsx from 'clsx';
import styles from './SearchInput.module.css';
import { Icon } from '../ui/Icon';

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
        <div className={clsx(styles.wrapper, className)}>
            <Icon name='search' />
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