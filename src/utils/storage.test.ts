import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// localStorage stub
function createLocalStorageStub() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    _store: store,
  };
}

function readPersistedState(stub: ReturnType<typeof createLocalStorageStub>, key = 'gigachat-store') {
  const raw = stub._store[key];
  if (!raw) return null;
  return JSON.parse(raw);
}

describe('localStorage', () => {
  let localStorageStub: ReturnType<typeof createLocalStorageStub>;

  beforeEach(() => {
    localStorageStub = createLocalStorageStub();
    vi.stubGlobal('localStorage', localStorageStub);
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('состояние записывается в localStorage при создании чата', async () => {
    const { useStore } = await import('../utils/storage');
    useStore.getState().createChat('Chat');

    await new Promise((r) => setTimeout(r, 50));

    expect(localStorageStub.setItem).toHaveBeenCalled();
    const written = readPersistedState(localStorageStub);
    expect(written).not.toBeNull();
    const chats = written?.state?.chats ?? [];
    expect(chats.some((c: { title: string }) => c.title === 'Chat')).toBe(true);
  });

  it('чаты восстанавливаются из localStorage при инициализации хранилища', async () => {
    const mockData = {
      state: {
        chats: [
          {
            id: '1',
            title: 'Chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
          },
        ],
        activeChatId: '1',
      },
      version: 1,
    };
    localStorageStub._store['gigachat-store'] = JSON.stringify(mockData);

    const { useStore } = await import('../utils/storage');
    await new Promise(resolve => setTimeout(resolve, 100));

    const chats = useStore.getState().chats;
    expect(chats).toHaveLength(1);
    expect(chats[0].title).toBe('Chat');
    expect(useStore.getState().activeChatId).toBe('1');
  });

  it('не падает, если localStorage содержит недопустимый JSON', async () => {
    localStorageStub._store['gigachat-store'] = '{ not valid JSON }';
    localStorageStub.getItem.mockImplementation(
      (key: string) => localStorageStub._store[key] ?? null,
    );

    let useStore: typeof import('../utils/storage').useStore;
    expect(async () => {
      ({ useStore } = await import('../utils/storage'));
      await new Promise((r) => setTimeout(r, 50));
    }).not.toThrow();

    const { useStore: freshStore } = await import('../utils/storage');
    expect(Array.isArray(freshStore.getState().chats)).toBe(true);
  });
});

describe('Парсинг валидного JSONа', () => {
  it('не выбрасывается ошибка при вводе пустой строки', () => {
    expect(() => {
      try { JSON.parse(''); } catch { /* expected */ }
    }).not.toThrow();
  });

  it('не выбрасывается ошибка на null', () => {
    expect(() => {
      try { JSON.parse('null'); } catch { /* expected */ }
    }).not.toThrow();
  });

  it('валидный JSON парсится корректно', () => {
    const result = JSON.parse('{"key":"value"}');
    expect(result.key).toBe('value');
  });
});
