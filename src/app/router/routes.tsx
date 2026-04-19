import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { ChatPage } from '../../pages/ChatPage';
import { ChatIndexPage } from '../../pages/ChatIndexPage';
import { NotFoundPage } from '../../pages/NotFoundPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <ChatIndexPage /> },
            { path: 'chat/:id', element: <ChatPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;