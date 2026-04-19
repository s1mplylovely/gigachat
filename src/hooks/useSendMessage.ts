import { useRef, useCallback } from 'react';
import { generateChatTitle, useStore } from '../utils/storage';
import {
  getAccessToken,
  sendMessage,
  sendMessageStream,
  buildMessagesPayload,
  GigaChatError,
} from '../api/gigachat';
import type { Chat, Message } from '../types';

// Отправка пользовательских сообщений и получение ответов (потоковые или не потоковые)
export function useSendMessage() {
  const store = useStore.getState;
  const { addMessage, appendStreamChunk, finalizeStream,
    setLoading, setStreaming, setError, updateChatTitle,
    setToken } = useStore();

  const abortRef = useRef<AbortController | null>(null);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    const { activeChatId, chats } = store();
    if (!activeChatId) return;

    const chat = chats.find((c: Chat) => c.id === activeChatId);
    if (!chat) return;

    const streaming = chat.messages.find((m: Message) => m.isStreaming);
    if (streaming) finalizeStream(activeChatId, streaming.id);

    setStreaming(false);
    setLoading(false);
  }, [store, finalizeStream, setStreaming, setLoading]);

  const send = useCallback(
    async (chatId: string, userContent: string) => {
      const state = store();
      const { authState, settings, chats } = state;

      if (!authState.credentials) {
        setError('Нет учётных данных. Войдите снова.');
        return;
      }

      const chat = chats.find((c: Chat) => c.id === chatId);
      if (!chat) return;

      setError(null);
      setLoading(true);

      try {
        // Убедиться, что токен валидный
        const token = await getAccessToken(authState.credentials, (t: string, exp: number) => {
          setToken(t, exp);
        });

        // Добавить сообщение пользователя
        addMessage(chatId, { role: 'user', content: userContent });

        // Авто-название чата
        const isFirstMessage = chat.messages.filter((m: Message) => m.role === 'user').length === 0;
        if (isFirstMessage) {
          const title = generateChatTitle(userContent);
          updateChatTitle(chatId, title);
        }

        // Перечитать чат после добавления сообщения пользователя
        const freshChat = store().chats.find((c: Chat) => c.id === chatId)!;
        // Создать api payload
        const payload = buildMessagesPayload(
          settings.systemPrompt || freshChat.systemPrompt,
          freshChat.messages.filter((m: Message) => m.role !== 'system'),
        );

        // Создать placeholder сообщения гигачата
        const assistantMsg = addMessage(chatId, {
          role: 'assistant',
          content: '',
          isStreaming: settings.streamingEnabled,
        });

        // Стрим
        if (settings.streamingEnabled) {
          setStreaming(true);
          setLoading(false);

          await new Promise<void>((resolve, reject) => {
            abortRef.current = sendMessageStream(
              payload,
              token,
              {
                model: settings.model,
                temperature: settings.temperature,
                maxTokens: settings.maxTokens,
              },
              {
                onChunk: (chunk: string) => {
                  appendStreamChunk(chatId, assistantMsg.id, chunk);
                },
                onDone: () => {
                  finalizeStream(chatId, assistantMsg.id);
                  setStreaming(false);
                  resolve();
                },
                onError: (err: any) => {
                  finalizeStream(chatId, assistantMsg.id);
                  setStreaming(false);
                  reject(err);
                },
              },
            );
          });
        } else {
          // Обычный запрос
          const content = await sendMessage(payload, token, {
            model: settings.model,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
          });
          // Заменить контент в placeholder'е (chunks или полное содержимое)
          appendStreamChunk(chatId, assistantMsg.id, content);
          finalizeStream(chatId, assistantMsg.id);
        }
      } catch (err: any) {
        if (err instanceof GigaChatError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Неизвестная ошибка');
        }
        //  Снять флаг потоковой передачи
      } finally {
        setLoading(false);
      }
    },
    [store, addMessage, appendStreamChunk, finalizeStream,
      setLoading, setStreaming, setError, setToken, updateChatTitle],
  );

  return { send, stopGeneration };
}
