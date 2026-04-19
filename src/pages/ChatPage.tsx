import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../utils/storage';
import type { RootStore } from '../utils/storage';
import { ChatWindow } from '../components/chat/ChatWindow';
import type { Chat } from '../types';

// "/chat/:id" route
export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setActiveChat = useStore((s: RootStore) => s.setActiveChat);
  const chats = useStore((s: RootStore) => s.chats);

  // синхронизировать URL :id с activeChatId 
  useEffect(() => {
    if (!id) {
      navigate('/', { replace: true });
      return;
    }
    // если чат не существует (удаленная / неверная ссылка) → "/"
    const exists = chats.some((c: Chat) => c.id === id);
    if (!exists) {
      navigate('/', { replace: true });
      return;
    }
    setActiveChat(id);
  }, [id, chats, setActiveChat, navigate]);

  if (!id) return null;

  return <ChatWindow chatId={id} />;
};