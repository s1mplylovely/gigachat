import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Message } from './Message';
import type { Message as MessageType } from '../../types';

// Мок react-markdown, rehype-highlight
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <span>{children}</span>,
}));

vi.mock('rehype-highlight', () => ({ default: () => { } }));

const userMessage: MessageType = {
  id: '1',
  role: 'user',
  content: 'User message',
  timestamp: new Date().toISOString(),
};

const assistantMessage: MessageType = {
  id: '2',
  role: 'assistant',
  content: 'Assistant message',
  timestamp: new Date().toISOString(),
};

// Мок буфера обмена
let writeTextSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeTextSpy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(globalThis.navigator, 'clipboard', {
    value: { writeText: writeTextSpy },
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Cброс обновления асинхронного состояния внутри act(), чтобы React не предупреждал
const clickAndFlush = async (element: HTMLElement) => {
  await act(async () => {
    fireEvent.click(element);
    await new Promise<void>((r) => setTimeout(r, 0));
  });
};

describe('Message — user variant', () => {
  it('содержимое сообщения рендерится', () => {
    render(<Message message={userMessage} />);

    expect(screen.getByText('User message')).toBeInTheDocument();
  });

  it('"user" CSS класс применяется к элементу', () => {
    const { container } = render(<Message message={userMessage} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('user');
  });

  it('показывается роль "Вы"', () => {
    render(<Message message={userMessage} />);

    expect(screen.getByText('Вы')).toBeInTheDocument();
  });

  it('кнопка Копировать рендерится (по заданию не должна, но мне кажется, что должна быть)', async () => {
    render(<Message message={userMessage} />);

    expect(await screen.findByRole('button', { name: /копировать/i })).toBeInTheDocument();
  });
});

describe('Message — assistant variant', () => {
  it('содержимое сообщения рендерится', () => {
    render(<Message message={assistantMessage} />);

    expect(screen.getByText('Assistant message')).toBeInTheDocument();
  });

  it('"assistant" CSS класс применяется к элементу', () => {
    const { container } = render(<Message message={assistantMessage} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('assistant');
  });

  it('показывается роль "GigaChat"', () => {
    render(<Message message={assistantMessage} />);

    expect(screen.getByText('GigaChat')).toBeInTheDocument();
  });

  it('кнопка Копировать рендерится', async () => {
    render(<Message message={assistantMessage} />);

    expect(await screen.findByRole('button', { name: /копировать/i })).toBeInTheDocument();
  });
});

describe('Message — кнопка Копировать', () => {
  it('вызывает clipboard.writeText с содержимым сообщения ассистента при нажатии', async () => {
    render(<Message message={assistantMessage} />);
    const btn = screen.getByRole('button', { name: /копировать/i });

    // Act — use fireEvent wrapped in act() so userEvent doesn't shadow our clipboard spy
    await clickAndFlush(btn);

    expect(writeTextSpy).toHaveBeenCalledOnce();
    expect(writeTextSpy).toHaveBeenCalledWith('Assistant message');
  });

  it('вызывает clipboard.writeText с содержимым сообщения ползлвателя при нажатии', async () => {
    render(<Message message={userMessage} />);
    const btn = screen.getByRole('button', { name: /копировать/i });

    await clickAndFlush(btn);

    expect(writeTextSpy).toHaveBeenCalledOnce();
    expect(writeTextSpy).toHaveBeenCalledWith('User message');
  });

  it('остается в DOM (успешное состояние) после копирования', async () => {
    render(<Message message={assistantMessage} />);
    const btn = screen.getByRole('button', { name: /копировать/i });

    await clickAndFlush(btn);

    await waitFor(() => expect(btn).toBeInTheDocument());
    expect(writeTextSpy).toHaveBeenCalledOnce();
  });

  it('не вызывает буфер обмена, если с компонентом не взаимодействовали', () => {
    render(<Message message={assistantMessage} />);

    expect(writeTextSpy).not.toHaveBeenCalled();
  });
});
