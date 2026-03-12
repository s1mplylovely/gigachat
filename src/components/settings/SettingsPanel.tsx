import React, { useState, useCallback } from 'react';
import type { Settings, GigaChatModel } from '../../types';

import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';

import { defaultSettings } from '../../data/mockData';

import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
    isOpen: boolean;
    settings: Settings;
    onSave: (settings: Settings) => void;
    onClose: () => void;
}

const models: GigaChatModel[] = [
    'GigaChat',
    'GigaChat-Plus',
    'GigaChat-Pro',
    'GigaChat-Max',
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    settings,
    onSave,
    onClose,
}) => {
    const [local, setLocal] = useState<Settings>(settings);

    const update = useCallback(
        <K extends keyof Settings>(key: K, value: Settings[K]) => {
            setLocal((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleThemeChange = (isDark: boolean) => {
        const root = document.documentElement;
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');

        update('theme', isDark ? 'dark' : 'light');
    };

    const handleReset = useCallback(() => {
        setLocal(defaultSettings);
    }, []);

    const handleSave = useCallback(() => {
        onSave(local);
        onClose();
    }, [local, onSave, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.backdrop} onClick={onClose} />

            <div className={styles.drawer}>
                {/* Header */}
                <header className={styles.header}>
                    <div>
                        <div className={styles.title}>Настройки</div>
                    </div>

                    <button className={styles.closeBtn} onClick={onClose}>
                        <svg className={styles.closeBtnIcon} viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </header>

                {/* Body */}
                <div className={styles.body}>
                    <SectionLabel>Модель</SectionLabel>

                    <select
                        className={styles.select}
                        value={local.model}
                        onChange={(e) =>
                            update('model', e.target.value as GigaChatModel)
                        }
                    >
                        {models.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    <SectionLabel>Параметры генерации</SectionLabel>

                    <div className={styles.sliderGroup}>
                        <Slider
                            label="Temperature"
                            min={0}
                            max={2}
                            step={0.1}
                            value={local.temperature}
                            onChange={(v) => update('temperature', v)}
                        />

                        <Slider
                            label="Top-P"
                            min={0}
                            max={1}
                            step={0.1}
                            value={local.topP}
                            onChange={(v) => update('topP', v)}
                        />

                        <div>
                            <div className={styles.inputLabel}>Max Tokens</div>
                            <input
                                className={styles.numberInput}
                                type="number"
                                min={64}
                                max={128000}
                                step={128}
                                value={local.maxTokens}
                                onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (isNaN(value)) value = 0;
                                    if (value > 128000) value = 128000;
                                    if (value < 0) value = 0;
                                    update('maxTokens', value);
                                }}
                            />
                        </div>
                    </div>

                    <SectionLabel>Системный промпт</SectionLabel>

                    <textarea
                        className={styles.textarea}
                        rows={4}
                        value={local.systemPrompt}
                        onChange={(e) =>
                            update('systemPrompt', e.target.value)
                        }
                    />

                    <SectionLabel>Интерфейс</SectionLabel>

                    <div className={styles.themeRow}>
                        <div>
                            <div className={styles.themeTitle}>Темная тема</div>
                        </div>
                        <Toggle
                            checked={local.theme === 'dark'}
                            onChange={(v) => handleThemeChange(v)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <footer className={styles.footer}>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={handleReset}
                        className={styles.resetBtn}
                    >
                        Сбросить
                    </Button>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleSave}
                        className={styles.saveBtn}
                    >
                        Сохранить
                    </Button>
                </footer>
            </div>
        </>
    );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <div className={styles.sectionLabel}>{children}</div>;
};