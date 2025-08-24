# 🚀 ДЕПЛОЙ ИНСТРУКЦИЯ

## Быстрый старт

### Frontend на Vercel

1. Заходи на https://vercel.com
2. Подключи GitHub аккаунт
3. Import Project → выбери репозиторий `porfolio`
4. Настройки:
   - **Framework:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`

### Backend на Railway

1. Заходи на https://railway.app
2. Подключи GitHub аккаунт
3. New Project → Deploy from GitHub repo → выбери `porfolio`
4. Настройки:
   - **Root Directory:** `backend`
   - **Start Command:** `npm run start:prod`

## Переменные окружения

### Railway (Backend)

```env
JWT_SECRET=твой-супер-секретный-ключ-для-продакшена
PORT=3000
FRONTEND_URL=https://твой-домен.vercel.app
```

### Vercel (Frontend)

```env
NEXT_PUBLIC_API_URL=https://твой-домен.up.railway.app
```

## Альтернативные варианты

### Render.com

- Бесплатный план
- Автодеплой из GitHub
- Поддержка Node.js и статических сайтов

### Netlify

- Отлично для фронтенда
- Бесплатный план
- Быстрый CDN

### Heroku

- Раньше был популярен
- Сейчас платный

## Проверка после деплоя

1. **Backend проверка:**

   - `GET https://твой-backend-домен/` - должен вернуть "Hello World!"
   - `POST https://твой-backend-домен/auth/login` - должен работать с тестовыми данными

2. **Frontend проверка:**
   - Открой `https://твой-frontend-домен`
   - Попробуй зарегистрироваться/войти
   - Проверь что дашборд работает

## Тестовые данные

После деплоя можешь входить с:

- john@example.com / password123
- admin@example.com / admin123

## Troubleshooting

### Проблемы CORS

- Убедись что FRONTEND_URL правильно настроен в Railway
- Проверь что домены точно совпадают

### 500 ошибки backend

- Проверь логи в Railway dashboard
- Убедись что все переменные окружения настроены

### Build ошибки frontend

- Проверь что NEXT_PUBLIC_API_URL настроен в Vercel
- Проверь логи build в Vercel dashboard

## Кастомные домены (опционально)

После успешного деплоя можешь:

1. Купить домен на Namecheap/GoDaddy
2. Настроить его в Vercel для фронтенда
3. Настроить поддомен для API

Пример:

- Frontend: https://myportfolio.com
- Backend: https://api.myportfolio.com
