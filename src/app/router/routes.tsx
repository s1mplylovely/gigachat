import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import styles from './styles.module.css';

const ChatIndexPage = lazy(() =>
    import('../../pages/ChatIndexPage').then((m) => ({ default: m.ChatIndexPage })),
);

const ChatPage = lazy(() =>
    import('../../pages/ChatPage').then((m) => ({ default: m.ChatPage })),
);

const NotFoundPage = lazy(() =>
    import('../../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function PageLoader() {
    return (
        <div
            className={styles.loaderContainer}
            aria-label="Загрузка страницы"
        >
            <span className={styles.spinner} />
            Загрузка…
        </div>
    );
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ChatIndexPage />
                    </Suspense>
                ),
            },
            {
                path: 'chat/:id',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ChatPage />
                    </Suspense>
                ),
            },
            {
                path: '*',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <NotFoundPage />
                    </Suspense>
                ),
            },
        ],
    },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;