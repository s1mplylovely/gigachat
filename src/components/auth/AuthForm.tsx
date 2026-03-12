import React, { useState } from 'react';
import type { AuthCredentials, ScopeType } from '../../types';
import { ErrorMessage } from '../ui/ErrorMessage';
import styles from './AuthForm.module.css';
import logo from '../../data/gigachat-horizontal-logo.svg';

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
                    <div className={styles.logoIcon}>
                        <img src={logo} alt="Logo" />
                    </div>
                </div>

                {/* Поле ввода пароля */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Credentials</label>
                    <input
                        type="password"
                        value={credentials}
                        onChange={(e) => { setCredentials(e.target.value); setError(''); }}
                        placeholder="Base64-строка"
                        className={`${styles.input} ${error ? styles.inputError : ''}`}
                    />
                    {error && <div style={{ marginTop: '8px' }}><ErrorMessage message={error} /></div>}
                </div>

                {/* Radio button */}
                <div className={styles.scopeGroup}>
                    <label className={styles.label}>Тип доступа</label>
                    <div className={styles.scopeList}>
                        {scopes.map((s) => (
                            <label
                                key={s.value}
                                className={`${styles.scopeItem} ${scope === s.value ? styles.scopeItemSelected : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="scope"
                                    value={s.value}
                                    checked={scope === s.value}
                                    onChange={() => setScope(s.value)}
                                    style={{ accentColor: 'var(--accent)', width: 14, height: 14 }}
                                />
                                <div>
                                    <div className={`${styles.scopeLabel} ${scope === s.value ? styles.scopeLabelSelected : ''}`}>
                                        {s.label}
                                    </div>
                                    <div className={styles.scopeValue}>{s.value}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <button className={styles.submitButton} onClick={handleSubmit}>
                    Войти
                </button>
            </div>
        </div>
    );
};