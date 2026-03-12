import React from 'react';
import styles from './AppLayout.module.css';
import clsx from 'clsx';

interface AppLayoutProps {
    sidebar: React.ReactNode;
    chatWindow: React.ReactNode;
    isSidebarOpen: boolean;
    onCloseSidebar: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    sidebar,
    chatWindow,
    isSidebarOpen,
    onCloseSidebar,
}) => {
    return (
        <div className={styles.layout}>

            {/* Mobile overlay */}
            <div
                className={clsx(styles.overlay, { [styles.overlayOpen]: isSidebarOpen })}
                onClick={onCloseSidebar}
            />

            {/* Sidebar */}
            <aside className={clsx(styles.sidebar, { [styles.sidebarOpen]: isSidebarOpen })}>
                {sidebar}
            </aside>

            {/* Chat Window */}
            <main className={styles.main}>
                {chatWindow}
            </main>

        </div >
    );
};