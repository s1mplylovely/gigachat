import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useStore } from '../../utils/storage';

// Icons не рендерят ничего для избежания проблем с импортом SVG в jsdom
vi.mock('../ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

const defaultSidebarProps = {
  isOpen: true,
  onClose: vi.fn(),
  onOpenSettings: vi.fn(),
};

function renderSidebar(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Sidebar {...defaultSidebarProps} />
    </MemoryRouter>
  );
}

function seedChats(titles: string[]) {
  const { createChat } = useStore.getState();
  // добавление в обратном порядке
  [...titles].reverse().forEach((title) => {
    act(() => {
      createChat(title);
    });
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  // Очистка хранилища
  useStore.setState({
    chats: [],
    activeChatId: null,
    isLoading: false,
    isStreaming: false,
    error: null,
    searchQuery: '',
  });
});

describe('Sidebar — отображение списка чатов', () => {
  it('показываются все чаты, когда поисковый запрос пуст', () => {
    seedChats(['1st chat', '2nd chat', '3rd chat']);

    renderSidebar();

    expect(screen.getByText('1st chat')).toBeInTheDocument();
    expect(screen.getByText('2nd chat')).toBeInTheDocument();
    expect(screen.getByText('3rd chat')).toBeInTheDocument();
  });

  it('показывается "Нет диалогов", когда нет чатов', () => {
    renderSidebar();

    expect(screen.getByText(/нет диалогов/i)).toBeInTheDocument();
  });
});

describe('Sidebar — фильтр поиска', () => {
  it('чаты фильтруются по названию, которое пользователь вводит в поиск', async () => {
    seedChats(['1st chat', '2nd chat', '3rd chat']);
    const user = userEvent.setup();
    renderSidebar();

    const searchInput = screen.getByRole('searchbox', { name: /поиск/i });
    await user.type(searchInput, '1st');

    // debounce
    await act(async () => {
      await new Promise((r) => setTimeout(r, 300));
    });

    expect(screen.getByText('1st chat')).toBeInTheDocument();
    expect(screen.queryByText('2nd chat')).not.toBeInTheDocument();
    expect(screen.queryByText('3rd chat')).not.toBeInTheDocument();
  });

  it('после очистки поля поиска снова отображаются все чаты', async () => {
    seedChats(['1st chat', '2nd chat']);
    const user = userEvent.setup();
    renderSidebar();
    const searchInput = screen.getByRole('searchbox', { name: /поиск/i });

    await user.type(searchInput, '1st');
    await act(async () => { await new Promise((r) => setTimeout(r, 300)); });
    await user.clear(searchInput);
    await act(async () => { await new Promise((r) => setTimeout(r, 300)); });

    expect(screen.getByText('1st chat')).toBeInTheDocument();
    expect(screen.getByText('2nd chat')).toBeInTheDocument();
  });

  it('поиск выполняется без учета регистра', async () => {
    seedChats(['Chat']);
    const user = userEvent.setup();
    renderSidebar();

    await user.type(screen.getByRole('searchbox', { name: /поиск/i }), 'chat');
    await act(async () => { await new Promise((r) => setTimeout(r, 300)); });

    expect(screen.getByText('Chat')).toBeInTheDocument();
  });
});

describe('Sidebar — удаление', () => {
  it('показывается диалоговое окно подтверждения удаления при нажатии кнопки Удалить', async () => {
    seedChats(['Chat to delete']);
    const user = userEvent.setup();
    renderSidebar();

    const deleteBtn = screen.getByTitle('Удалить');
    await user.click(deleteBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/удалить диалог/i)).toBeInTheDocument();
  });

  it('чат удаляется после того, как пользователь подтвердил удаление', async () => {
    seedChats(['Chat to delete']);
    const user = userEvent.setup();
    renderSidebar();

    await user.click(screen.getByTitle('Удалить'));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^удалить$/i }));

    expect(screen.queryByText('Chat to delete')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('чат остается, если пользователь отменил удаление', async () => {
    seedChats(['Chat to delete']);
    const user = userEvent.setup();
    renderSidebar();

    await user.click(screen.getByTitle('Удалить'));
    await user.click(screen.getByRole('button', { name: /отмена/i }));

    expect(screen.getByText('Chat to delete')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
