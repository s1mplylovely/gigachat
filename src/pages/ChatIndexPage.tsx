import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../utils/storage';
import type { RootStore } from '../utils/storage';
import { EmptyState } from '../components/ui/EmptyState';

// "/" route
export const ChatIndexPage: React.FC = () => {
  const activeChatId = useStore((s: RootStore) => s.activeChatId);
  const chats = useStore((s: RootStore) => s.chats);

  // Если есть активный чат → /chat/:id
  if (activeChatId) {
    return <Navigate to={`/chat/${activeChatId}`} replace />;
  }
  // Если есть чаты, но нет активного → последний чат
  if (chats.length > 0) {
    return <Navigate to={`/chat/${chats[0].id}`} replace />;
  }
  // Иначе → empty state
  return <EmptyState />;
};
