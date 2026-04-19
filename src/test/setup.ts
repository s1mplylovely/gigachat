import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Заглушка CSS Modules
vi.mock('*.module.css', () => new Proxy({}, { get: (_t, k) => k }));

// Заглушка highlight.js
vi.mock('highlight.js/styles/github-dark.css', () => ({}));

// Отключение предупреждений
vi.spyOn(console, 'warn').mockImplementation(() => { });

// React act() срабатывают, когда происходят обновления асинхронного состояния после синхронного assertion 
const originalError = console.error.bind(console);
vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
  originalError(...args);
});