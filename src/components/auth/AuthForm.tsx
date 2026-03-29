import React, { useState } from 'react';
import clsx from 'clsx';
import type { AuthCredentials, ScopeType } from '../../types';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import styles from './AuthForm.module.css';

interface AuthFormProps {
    onLogin: (credentials: AuthCredentials) => void;
}

const scopes: { value: ScopeType; label: string; }[] = [
    { value: 'GIGACHAT_API_PERS', label: 'Personal' },
    { value: 'GIGACHAT_API_B2B', label: 'Business' },
    { value: 'GIGACHAT_API_CORP', label: 'Corporate' },
];

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
    const [credentials, setCredentials] = useState('');
    const [scope, setScope] = useState<ScopeType>('GIGACHAT_API_PERS');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!credentials.trim()) {
            setError('Поле не может быть пустым');
            return;
        }
        setError('');
        onLogin({ credentials, scope });
    };

    return (
        <div className={styles.container}>
            <div className={styles.backgroundCircle}>
                <div className={styles.circle} />
            </div>

            <div className={styles.card}>
                <div className={styles.logoRow}>
                    <Icon name='logo' size={50} />
                </div>

                {/* Поле ввода пароля */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Credentials</label>
                    <input
                        type="password"
                        value={credentials}
                        onChange={(e) => { setCredentials(e.target.value); setError(''); }}
                        placeholder="Base64-строка"
                        className={clsx(styles.input, { [styles.inputError]: error })}
                    />
                    {error && <div className={styles.errorMessage}><ErrorMessage message={error} /></div>}
                </div>

                {/* Radio button */}
                <div className={styles.scopeGroup}>
                    <label className={styles.label}>Тип доступа</label>
                    <div className={styles.scopeList}>
                        {scopes.map((s) => (
                            <label
                                key={s.value}
                                className={clsx(styles.scopeItem, { [styles.scopeItemSelected]: scope === s.value })}
                            >
                                <input
                                    type="radio"
                                    name="scope"
                                    value={s.value}
                                    checked={scope === s.value}
                                    onChange={() => setScope(s.value)}
                                    className={styles.radioButton}
                                />
                                <div>
                                    <div className={clsx(styles.scopeLabel, { [styles.scopeLabelSelected]: scope === s.value })}>
                                        {s.label}
                                    </div>
                                    <div className={styles.scopeValue}>{s.value}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    className={styles.submitButton}
                >
                    Войти
                </Button>
            </div>
        </div>
    );
};