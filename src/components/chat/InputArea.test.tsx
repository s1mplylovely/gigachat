import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputArea } from './InputArea';

const defaultProps = {
  onSend: vi.fn(),
  onStop: vi.fn(),
  isLoading: false,
  isStreaming: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

function renderInputArea(overrides: Partial<typeof defaultProps> = {}) {
  return render(<InputArea {...defaultProps} {...overrides} />);
}

describe('InputArea — Кнопка отправить', () => {
  it('отключена, когда поле ввода пустое', () => {
    renderInputArea();

    const sendBtn = screen.getByRole('button', { name: /отправить/i });
    expect(sendBtn).toBeDisabled();
  });

  it('включается после того, как пользователь вводит текст (не пробелы)', async () => {
    const user = userEvent.setup();
    renderInputArea();

    await user.type(screen.getByRole('textbox'), 'Hello');

    expect(screen.getByRole('button', { name: /отправить/i })).not.toBeDisabled();
  });

  it('остается отключенной, если ввод содержит только пробелы', async () => {
    const user = userEvent.setup();
    renderInputArea();

    await user.type(screen.getByRole('textbox'), '   ');

    expect(screen.getByRole('button', { name: /отправить/i })).toBeDisabled();
  });
});

describe('InputArea — Отправка сообщения', () => {
  it('onSend с trimmed сообщением вызывается при нажатии кнопки Отправить', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    renderInputArea({ onSend });

    await user.type(screen.getByRole('textbox'), '  Hello world  ');
    await user.click(screen.getByRole('button', { name: /отправить/i }));

    expect(onSend).toHaveBeenCalledOnce();
    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  it('поле ввода очищается после отправки', async () => {
    const user = userEvent.setup();
    renderInputArea();
    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'Message');
    await user.click(screen.getByRole('button', { name: /отправить/i }));

    expect(textarea).toHaveValue('');
  });

  it('onSend вызывается при нажатии Enter (без Shift)', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    renderInputArea({ onSend });

    await user.type(screen.getByRole('textbox'), 'Message{Enter}');

    expect(onSend).toHaveBeenCalledOnce();
    expect(onSend).toHaveBeenCalledWith('Message');
  });

  it('onSend не вызывается на Shift+Enter (вставляется новая строка)', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    renderInputArea({ onSend });

    await user.type(screen.getByRole('textbox'), 'Line one');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(onSend).not.toHaveBeenCalled();
  });

  it('onSend не вызывается при пустом поле ввода, если Enter нажат', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    renderInputArea({ onSend });

    await user.type(screen.getByRole('textbox'), '{Enter}');

    expect(onSend).not.toHaveBeenCalled();
  });
});

describe('InputArea — Загрузка / стриминг', () => {
  it('рендерится кнопка остановки генерации (не отправки) пока идет загрузка (isLoading true)', () => {
    renderInputArea({ isLoading: true });

    expect(screen.getByRole('button', { name: /остановить/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /отправить/i })).not.toBeInTheDocument();
  });

  it('рендерится кнопка остановки генерации (не отправки) пока идет генерация (isStreaming true)', () => {
    renderInputArea({ isStreaming: true });

    expect(screen.getByRole('button', { name: /остановить/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /отправить/i })).not.toBeInTheDocument();
  });

  it('onStop вызывается при нажатии кнопки остановки генерации', async () => {
    const onStop = vi.fn();
    const user = userEvent.setup();
    renderInputArea({ isStreaming: true, onStop });

    await user.click(screen.getByRole('button', { name: /остановить/i }));

    expect(onStop).toHaveBeenCalledOnce();
  });

  it('поле ввода недоступно, пока идет загрузка', () => {
    renderInputArea({ isLoading: true });

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('поле ввода недоступно, пока идет генерация', () => {
    renderInputArea({ isStreaming: true });

    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
