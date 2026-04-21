# Домашнее задание по дисциплине Основы frontend-разработки

Студент: Нащёкина Ю.А.

## Демо

Веб-интерфейс для общения с GigaChat от Сбера. Поддерживает потоковую передачу ответов, историю диалогов и настройку параметров модели.

Ссылка на развернутое приложение

[Скриншоты работы](/docs/)

---

## Стек

| Категория | Технология | Версия |
|---|---|---|
| UI-библиотека | React | 19.2 |
| Язык | TypeScript | 5.9 |
| Маршрутизация | React Router DOM | 7.14 |
| Стейт-менеджер | Zustand + Immer | 5.0 / 11.1 |
| Стилизация | CSS Modules | — |
| Сборщик | Vite | 7.3 |
| Рендер Markdown | react-markdown + rehype-highlight | 10.1 / 7.0 |
| Подсветка кода | highlight.js | 11.11 |
| Тесты | Vitest + React Testing Library | 4.1 / 16.x |
| Деплой | Vercel | — |

---

## Запуск локально

### Требования

- Node.js ≥ 18
- npm ≥ 9
- GigaChat API authorization key

### Пошаговая инструкция

1. Клонировать репозиторий

```bash
git clone https://github.com/s1mplylovely/gigachat.git
cd gigachat
```

2. Установить зависимости

```bash
npm install
```

3. Создать файл переменных окружения

```bash
cp .env.example .env.local
```

Переменные окружения описаны в файле [`.env.example`](.env.example). Скопируйте его в `.env.local` и заполните реальными значениями (см. [Переменные окружения](##переменные-окружения)).

4. Запустить dev-сервер

```bash
npm run dev
```

Приложение откроется по адресу [http://localhost:5173](http://localhost:5173).

Dev-сервер автоматически проксирует запросы к GigaChat API через Vite (см. `vite.config.ts`), поэтому CORS-ограничения не мешают локальной разработке.

5. Сборка для продакшена

```bash
npm run build      ## собрать в dist/
npm run preview    ## локально проверить собранный бандл
```

### Тесты

Запустить все тесты (один раз)

```bash
npm test
```

Запустить в watch-режиме при разработке

```bash
npm run test:watch
```

Отчёт о покрытии

```bash
npm run test:coverage
```

#### Что покрыто тестами:

| Модуль | Файл | Что проверяется |
|---|---|---|
| Zustand store | `chatStore.test.ts` | `addMessage`, `createChat`, `deleteChat`, `editChat`, `generateChatTitle` |
| `InputArea` | `InputArea.test.tsx` | Disabled-состояние кнопки Send, отправка непустого сообщения по клику и Enter, Stop-кнопка при стриминге |
| `Message` | `Message.test.tsx` | Рендер user/assistant-вариантов, CSS-классы, кнопка Copy и вызов `clipboard.writeText` |
| `Sidebar` | `Sidebar.test.tsx` | Показ всех чатов, фильтрация поиском (с дебаунсом), диалог подтверждения удаления |
| localStorage | `storage.test.ts` | Сохранение состояния, восстановление при инициализации, устойчивость к битому JSON |

---

## Переменные окружения

### Серверные (только для Vercel / Serverless Functions)

- `GIGACHAT_CREDENTIALS` - ключ авторизации GigaChat API в формате Base64 (`ClientId:ClientSecret`)
- `GIGACHAT_SCOPE` - область доступа API. Одно из значений: `GIGACHAT_API_PERS` (личный), `GIGACHAT_API_B2B` (бизнес), `GIGACHAT_API_CORP` (корпоративный).

### Публичные (доступны в браузере)

| Переменная | По умолчанию | Описание |
|---|---|---|
| `VITE_API_BASE` | `/api` | Базовый URL для API-прокси. На Vercel указывает на Serverless Functions. При локальной разработке Vite-прокси перенаправляет запросы на серверы GigaChat. |
| `VITE_DEFAULT_THEME` | `dark` | Тема по умолчанию при первом запуске. Допустимые значения: `dark`, `light`. |