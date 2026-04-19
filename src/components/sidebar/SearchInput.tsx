import React, { useState, memo } from 'react';
import styles from './SearchInput.module.css';
import { useStore, useSearchQuery } from '../../utils/storage';
import { useDebounce } from '../../hooks/useDebounce';
import { Icon } from '../ui/Icon';

const DEBOUNCE_TIME = 250;

export const SearchInput: React.FC = memo(() => {
    const { setSearchQuery } = useStore();
    const searchQuery = useSearchQuery();

    const [localSearch, setLocalSearch] = useState(searchQuery);
    const debouncedSearch = useDebounce(localSearch, DEBOUNCE_TIME);

    React.useEffect(() => {
        if (debouncedSearch !== searchQuery) {
            setSearchQuery(debouncedSearch);
        }
    }, [debouncedSearch, searchQuery, setSearchQuery]);

    React.useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
    };

    return (
        <div className={styles.wrapper}>
            <Icon name='search' />
            <input
                type="search"
                value={localSearch}
                onChange={handleChange}
                aria-label="Поиск чатов"
                placeholder="Поиск чатов..."
                className={styles.input}
            />
        </div>
    );
});

SearchInput.displayName = 'SearchInput';