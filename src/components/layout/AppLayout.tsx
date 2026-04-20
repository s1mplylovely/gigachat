import React, { useState, useCallback, lazy, Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import styles from './AppLayout.module.css';
import { useIsAuthenticated } from '../../utils/storage';
import { AuthForm } from '../auth/AuthForm';
import { ErrorBoundary } from '../ErrorBoundary';
import { SidebarLazy } from '../sidebar/SidebarLazy';
import '../../styles/theme.css';

const Sidebar = lazy(() =>
    import('../sidebar/Sidebar').then((m) => ({ default: m.Sidebar })),
);

const SettingsPanel = lazy(() =>
    import('../settings/SettingsPanel').then((m) => ({ default: m.SettingsPanel })),
);

const SettingsFallback = () => null;

export const AppLayout: React.FC = memo(() => {
    const isAuthenticated = useIsAuthenticated();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleCloseSettings = useCallback(() => setSettingsOpen(false), []);
    const handleOpenSettings = useCallback(() => setSettingsOpen(true), []);
    const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);
    const handleToggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

    if (!isAuthenticated) return <AuthForm />;

    return (
        <div className={styles.layout}>

            {/* Mobile overlay */}
            <div
                className={clsx(styles.overlay, { [styles.overlayOpen]: sidebarOpen })}
                onClick={handleCloseSidebar}
            />

            {/* Sidebar */}
            <ErrorBoundary scope="Sidebar">
                <Suspense fallback={<SidebarLazy />}>
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={handleCloseSidebar}
                        onOpenSettings={handleOpenSettings}
                    />
                </Suspense>
            </ErrorBoundary>

            {/* Main content */}
            <main className={styles.main}>
                <Outlet context={{
                    onOpenSettings: handleOpenSettings,
                    onToggleSidebar: handleToggleSidebar,
                }} />
            </main>

            {/* Настройки */}
            {settingsOpen && (
                <ErrorBoundary scope="SettingsPanel">
                    <Suspense fallback={<SettingsFallback />}>
                        <SettingsPanel isOpen={settingsOpen} onClose={handleCloseSettings} />
                    </Suspense>
                </ErrorBoundary>
            )}
        </div >
    );
});

AppLayout.displayName = 'AppLayout';