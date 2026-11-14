# Canvas Block Game

Block Blast на canvas (React + Vite) с бэкендом на ASP.NET Core 8: регистрация, вход и таблица лидеров.

## Запуск в dev-режиме

Бэкенд (http://localhost:5226, Swagger — `/swagger`). База SQLite `blockblast.db` создаётся сама при первом запуске:

```bash
dotnet run --project backend/BlockBlast --launch-profile http
```

Фронтенд (http://localhost:5173). Запросы `/api` проксируются на бэкенд, см. `frontend/vite.config.ts`:

```bash
cd frontend && npm install && npm run dev
```

## API

| Метод | Путь | Описание |
| --- | --- | --- |
| POST | `/api/auth/register` | `{ username, password }` → `{ token, user }` |
| POST | `/api/auth/login` | `{ username, password }` → `{ token, user }` |
| GET | `/api/auth/me` | текущий игрок (нужен токен) |
| POST | `/api/scores` | `{ score }` — результат партии (нужен токен) |
| GET | `/api/leaderboard?limit=10` | топ игроков и место текущего игрока |

Токен передаётся в заголовке `Authorization: Bearer <token>`.

## Продакшен

- Ключ подписи JWT задаётся через переменную окружения `Jwt__Key` (не короче 32 символов). Ключ из `appsettings.Development.json` годится только для разработки.
- Если фронтенд и API живут на разных доменах, адрес API задаётся через `VITE_API_URL` при сборке фронтенда, а на бэкенде нужно включить CORS.
