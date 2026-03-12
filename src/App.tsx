import React, { useState } from 'react';
import './styles/theme.css';

import type { AppState, Chat } from './types';
import { mockChats, defaultSettings } from './data/mockData';

import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const [appState, setAppState] = useState<AppState>({
    activeChatId: mockChats[0].id,
    isSidebarOpen: false,
    isTyping: true,
    settings: defaultSettings,
  });

  // Тема
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', appState.settings.theme);
  }, [appState.settings.theme]);

  const activeChat = chats.find((c) => c.id === appState.activeChatId) ?? null;

  const handleNewChat = () => {
    const newChat: Chat = {
      id: String(Date.now()),
      title: 'Новый чат',
      lastMessageDate: new Date(),
      isActive: false,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setAppState((s) => ({ ...s, activeChatId: newChat.id, isTyping: false }));
  };

  const handleToggleSidebar = () => {
    setAppState((s) => ({ ...s, isSidebarOpen: !s.isSidebarOpen }));
  };

  return (
    <AppLayout
      isSidebarOpen={appState.isSidebarOpen}
      onCloseSidebar={() => setAppState((s) => ({ ...s, isSidebarOpen: false }))}
      sidebar={
        <Sidebar
          onNewChat={handleNewChat}
        />
      }
      chatWindow={
        <ChatWindow
          chat={activeChat}
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={appState.isSidebarOpen}
        />
      }
    />
  );
};

export default App;