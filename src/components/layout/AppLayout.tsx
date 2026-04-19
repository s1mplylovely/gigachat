import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import styles from './AppLayout.module.css';
import { useIsAuthenticated } from '../../utils/storage';
import { AuthForm } from '../auth/AuthForm';
import { Sidebar } from '../sidebar/Sidebar';
import { SettingsPanel } from '../settings/SettingsPanel';
import '../../styles/theme.css';

export const AppLayout: React.FC = () => {
    const isAuthenticated = useIsAuthenticated();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!isAuthenticated) return <AuthForm />;

    return (
        <div className={styles.layout}>

            {/* Mobile overlay */}
            <div
                className={clsx(styles.overlay, { [styles.overlayOpen]: sidebarOpen })}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpenSettings={() => setSettingsOpen(true)}
            />

            {/* Main content */}
            <main className={styles.main}>
                <Outlet context={{
                    onOpenSettings: () => setSettingsOpen(true),
                    onToggleSidebar: () => setSidebarOpen((v) => !v)
                }} />
            </main>

            {/* Настройки */}
            <SettingsPanel
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </div >
    );
};

AppLayout.displayName = 'AppLayout';