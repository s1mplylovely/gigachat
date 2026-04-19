import React, { useState, useEffect, memo } from 'react';
import { useStore, useSettings } from '../../utils/storage';
import type { Settings, GigaChatModel } from '../../types';

import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const MODELS: GigaChatModel[] = [
    'GigaChat',
    'GigaChat-Plus',
    'GigaChat-Pro',
    'GigaChat-Max',
];

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(({ isOpen, onClose }) => {
    const globalSettings = useSettings();
    const { updateSettings, resetSettings, logout } = useStore();
    // Фиксируется только при сохранении
    const [local, setLocal] = useState<Settings>(globalSettings);

    // Синхронизировать при открытии панели
    useEffect(() => {
        if (isOpen) setLocal(globalSettings);
    }, [isOpen, globalSettings]);

    // Применить тему
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', local.theme);
    }, [local.theme]);

    const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
        setLocal((d) => ({ ...d, [key]: value }));

    const handleSave = () => {
        updateSettings(local);
        document.documentElement.setAttribute('data-theme', local.theme);
        onClose();
    };

    const handleReset = () => {
        resetSettings();
        setLocal(globalSettings); // будет повторная синхронизация с useEffect
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.backdrop} onClick={onClose} />

            <div className={styles.drawer}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.title}>Настройки</div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <Icon name='close' size={18} />
                    </button>
                </header>

                {/* Body */}
                <div className={styles.body}>

                    <SectionLabel>Модель</SectionLabel>
                    <select
                        className={styles.select}
                        value={local.model}
                        onChange={(e) => update('model', e.target.value as GigaChatModel)}
                    >
                        {MODELS.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    <SectionLabel>Потоковый режим</SectionLabel>
                    <div className={styles.themeRow}>
                        <div>
                            <div className={styles.themeTitle}>Стриминг (SSE)</div>
                        </div>
                        <Toggle
                            checked={local.streamingEnabled}
                            onChange={(v) => update('streamingEnabled', v)}
                        />
                    </div>


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
                                min={1024}
                                max={32768}
                                step={1024}
                                value={local.maxTokens}
                                onChange={(e) => {
                                    const input = e.target;
                                    const min = Number(input.min);
                                    const max = Number(input.max);
                                    let value = Number(e.target.value);
                                    if (isNaN(value)) value = min;
                                    if (value > max) value = max;
                                    if (value < min) value = min;
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
                        placeholder="Инструкции для GigaChat..."
                    />

                    <SectionLabel>Интерфейс</SectionLabel>
                    <div className={styles.themeRow}>
                        <div>
                            <div className={styles.themeTitle}>Темная тема</div>
                        </div>
                        <Toggle
                            checked={local.theme === 'dark'}
                            onChange={(v) => update('theme', v ? 'dark' : 'light')}
                        />
                    </div>

                    <SectionLabel>Аккаунт</SectionLabel>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={logout}
                        className={styles.logoutBtn}
                    >
                        Выйти
                    </Button>

                </div>

                {/* Footer */}
                <footer className={styles.footer}>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={handleReset}
                        className={styles.resetBtn}>
                        Сбросить
                    </Button>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleSave}
                        className={styles.saveBtn}>
                        Сохранить
                    </Button>
                </footer>
            </div >
        </>
    );
});

SettingsPanel.displayName = 'SettingsPanel';

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <div className={styles.sectionLabel}>{children}</div>;
};