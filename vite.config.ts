import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  base: '/',

  server: mode === 'development'
    ? {
      proxy: {
        '/api/oauth': {
          target: 'https://ngw.devices.sberbank.ru:9443',
          changeOrigin: true,
          secure: false,
          rewrite: () => '/api/v2/oauth',
        },
        '/api/gigachat': {
          target: 'https://gigachat.devices.sberbank.ru',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/gigachat/, '/api/v1'),
        },
      },
    }
    : undefined,

  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('react-router')
          ) {
            return 'vendor-react';
          }

          if (id.includes('highlight.js')) {
            return 'vendor-hljs';
          }

          if (
            id.includes('react-markdown') ||
            id.includes('remark') ||
            id.includes('rehype')
          ) {
            return 'vendor-markdown';
          }

          if (id.includes('zustand') || id.includes('immer')) {
            return 'vendor-state';
          }
        },
      },
    },
  },
}));