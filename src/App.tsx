import React, { useEffect, useState } from 'react';
import './styles/theme.css';

import type { AppState, AuthCredentials, Chat, Settings } from './types';
import { mockChats, defaultSettings } from './data/mockData';

import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { AuthForm } from './components/auth/AuthForm';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const App: React.FC = () => {
  const [allChats] = useState<Chat[]>(mockChats);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

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

  React.useEffect(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) {
      setChats(allChats);
      setAppState((s) => ({
        ...s,
        activeChatId: allChats[0]?.id ?? null,
      }));
      return;
    }
    const filtered = allChats.filter((chat) =>
      chat.title.toLowerCase().includes(q)
    );

    setChats(filtered);

    setAppState((s) => {
      const isActiveStillVisible = filtered.some(
        (c) => c.id === s.activeChatId
      );
      return {
        ...s,
        activeChatId: isActiveStillVisible
          ? s.activeChatId
          : filtered[0]?.id ?? null,
      };
    });
  }, [debouncedQuery, allChats]);


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

  const handleSelectChat = (id: string) => {
    setAppState((s) => ({ ...s, activeChatId: id, isSidebarOpen: false }));
  };

  const handleEditChat = (id: string) => {
    const t = window.prompt('Новое название:');
    if (t?.trim()) setChats(p => p.map(c => c.id === id ? { ...c, title: t.trim() } : c));
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setAppState((s) => ({
      ...s,
      activeChatId: s.activeChatId === id ? (chats[0]?.id ?? null) : s.activeChatId,
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
          chats={chats}
          activeChatId={appState.activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onEditChat={handleEditChat}
          onDeleteChat={handleDeleteChat}
          onSearch={handleSearch}
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