import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, generateChatTitle } from '../utils/storage';

const getState = () => useStore.getState();

beforeEach(() => {
  useStore.setState({
    chats: [],
    activeChatId: null,
    isLoading: false,
    isStreaming: false,
    error: null,
    searchQuery: '',
  });
});

// addMessage
describe('addMessage', () => {
  it('добавляет сообщение в нужный чат, увеличивая количество сообщений на 1', () => {
    const chat = getState().createChat('Hello world');
    const initialCount = getState().chats.find((c) => c.id === chat.id)!.messages.length;

    getState().addMessage(chat.id, { role: 'user', content: 'First message' });

    const updatedChat = getState().chats.find((c) => c.id === chat.id)!;
    expect(updatedChat.messages).toHaveLength(initialCount + 1);
  });

  it('помещает новое сообщение в конец массива сообщений', () => {
    const chat = getState().createChat();
    getState().addMessage(chat.id, { role: 'user', content: 'Message 1' });
    getState().addMessage(chat.id, { role: 'assistant', content: 'Message 2' });

    getState().addMessage(chat.id, { role: 'user', content: 'Last message' });

    const messages = getState().chats.find((c) => c.id === chat.id)!.messages;
    expect(messages.at(-1)!.content).toBe('Last message');
  });

  it('присваивает новому сообщению уникальный идентификатор и ISO-временную метку', () => {
    const chat = getState().createChat();

    const msg = getState().addMessage(chat.id, { role: 'user', content: 'Hi' });

    expect(msg.id).toBeTruthy();
    expect(() => new Date(msg.timestamp)).not.toThrow();
    expect(new Date(msg.timestamp).toISOString()).toBe(msg.timestamp);
  });

  it('ничего не делает, если chatId не существует', () => {
    getState().addMessage('nonexistent-id', { role: 'user', content: 'Ghost' });

    expect(getState().chats).toHaveLength(0);
  });

  it('не мутирует исходный массив сообщений', () => {
    const chat = getState().createChat();
    const before = getState().chats.find((c) => c.id === chat.id)!.messages;

    getState().addMessage(chat.id, { role: 'user', content: 'New' });

    const after = getState().chats.find((c) => c.id === chat.id)!.messages;
    expect(after).not.toBe(before);
  });
});

// createChat
describe('createChat', () => {
  it('добавляет новый чат в массив чатов', () => {
    getState().createChat('My first chat');

    expect(getState().chats).toHaveLength(1);
  });

  it('возвращает объект чата с уникальным идентификатором', () => {
    const a = getState().createChat();
    const b = getState().createChat();

    expect(a.id).toBeTruthy();
    expect(b.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });

  it('добавляет новый чат в начало списка, чтобы он отображался первым', () => {
    getState().createChat('Old chat');
    const oldId = getState().chats[0].id;

    const newChat = getState().createChat('New chat');

    expect(getState().chats[0].id).toBe(newChat.id);
    expect(getState().chats[1].id).toBe(oldId);
  });

  it('устанавливает activeChatId на вновь созданный чат', () => {
    const chat = getState().createChat();

    expect(getState().activeChatId).toBe(chat.id);
  });

  it('создает пустой массив сообщений для нового чата', () => {
    const chat = getState().createChat();

    expect(getState().chats.find((c) => c.id === chat.id)!.messages).toEqual([]);
  });
});

// deleteChat
describe('deleteChat', () => {
  it('удаляет чат из массива чатов', () => {
    const chat = getState().createChat();

    getState().deleteChat(chat.id);

    expect(getState().chats.find((c) => c.id === chat.id)).toBeUndefined();
  });

  it('не удаляет другие чаты', () => {
    const a = getState().createChat('A');
    const b = getState().createChat('B');

    getState().deleteChat(a.id);

    expect(getState().chats.find((c) => c.id === b.id)).toBeDefined();
  });

  it('сбрасывает activeChatId в null, когда удаляется активный чат', () => {
    const chat = getState().createChat();
    expect(getState().activeChatId).toBe(chat.id);

    getState().deleteChat(chat.id);

    expect(getState().activeChatId).toBeNull();
  });

  it('не сбрасывает activeChatId, когда удаляется неактивный чат', () => {
    const a = getState().createChat('A');
    const b = getState().createChat('B');
    expect(getState().activeChatId).toBe(b.id);

    getState().deleteChat(a.id);

    expect(getState().activeChatId).toBe(b.id);
  });

  it('корректно обрабатывает удаление несуществующего id', () => {
    getState().createChat();
    const countBefore = getState().chats.length;

    getState().deleteChat('does-not-exist');

    expect(getState().chats).toHaveLength(countBefore);
  });
});

// editChat
describe('editChat', () => {
  it('обновляет заголовок нужного чата', () => {
    const chat = getState().createChat('Old title');

    getState().editChat(chat.id, { title: 'New title' });

    expect(getState().chats.find((c) => c.id === chat.id)!.title).toBe('New title');
  });

  it('не влияет на другие чаты при переименовании', () => {
    const a = getState().createChat('Chat A');
    const b = getState().createChat('Chat B');

    getState().editChat(a.id, { title: 'Renamed A' });

    expect(getState().chats.find((c) => c.id === b.id)!.title).toBe('Chat B');
  });

  it('ничего не делает, если chatId не существует', () => {
    const chat = getState().createChat('Stable');

    getState().editChat('ghost-id', { title: 'Should not appear' });

    expect(getState().chats.find((c) => c.id === chat.id)!.title).toBe('Stable');
  });
});

// generateChatTitle
describe('generateChatTitle', () => {
  it('возвращает "Новый диалог" для неопределенного (undefined) ввода', () => {
    expect(generateChatTitle(undefined)).toBe('Новый диалог');
  });

  it('возвращает "Новый диалог" для пустой строки', () => {
    expect(generateChatTitle('')).toBe('Новый диалог');
  });

  it('возвращает "Новый диалог" для строк короче MIN_LENGTH (3)', () => {
    expect(generateChatTitle('Hi')).toBe('Новый диалог');
  });

  it('возвращает сообщение как есть, если оно в пределах лимита 35 символов', () => {
    const msg = 'Short title';
    expect(generateChatTitle(msg)).toBe(msg);
  });

  it('обрезает сообщения длиннее 35 символов и добавляет "…"', () => {
    const long = 'Длинное сообщение, в котором больше тридцати пяти символов';
    const result = generateChatTitle(long);

    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(36);
  });
});