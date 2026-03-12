import React, { useState } from 'react';
import './styles/theme.css';

import type { AppState, AuthCredentials, Chat, Settings } from './types';
import { mockChats, defaultSettings } from './data/mockData';

import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { AuthForm } from './components/auth/AuthForm';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    activeChatId: mockChats[0].id,
    isSettingsOpen: false,
    isSidebarOpen: false,
    isTyping: true,
    settings: defaultSettings,
  });

  // Тема
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', appState.settings.theme);
  }, [appState.settings.theme]);

  const activeChat = chats.find((c) => c.id === appState.activeChatId) ?? null;

  const handleLogin = (_credentials: AuthCredentials) => {
    setAppState((s) => ({ ...s, isAuthenticated: true }));
  };

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

  const handleOpenSettings = () => setAppState((s) => ({ ...s, isSettingsOpen: true }));
  const handleCloseSettings = () => setAppState((s) => ({ ...s, isSettingsOpen: false }));

  const handleSaveSettings = (settings: Settings) => {
    setAppState((s) => ({ ...s, settings }));
  };

  const handleToggleSidebar = () => {
    setAppState((s) => ({ ...s, isSidebarOpen: !s.isSidebarOpen }));
  };

  if (!appState.isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <AppLayout
      isSidebarOpen={appState.isSidebarOpen}
      onCloseSidebar={() => setAppState((s) => ({ ...s, isSidebarOpen: false }))}
      sidebar={
        <Sidebar
          onNewChat={handleNewChat}
          onOpenSettings={handleOpenSettings}
        />
      }
      chatWindow={
        <ChatWindow
          chat={activeChat}
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={appState.isSidebarOpen}
        />
      }
      settingsPanel={
        <SettingsPanel
          isOpen={appState.isSettingsOpen}
          settings={appState.settings}
          onSave={handleSaveSettings}
          onClose={handleCloseSettings}
        />
      }
    />
  );
};

export default App;
