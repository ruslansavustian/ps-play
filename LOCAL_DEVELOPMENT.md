# 🛠️ ЛОКАЛЬНАЯ РАЗРАБОТКА

## 🚀 Быстрый старт

### **Требования:**

- Docker и Docker Compose
- Node.js 18+
- npm

### **1. Запуск базы данных:**

```bash
# Автоматический setup
./scripts/dev-setup.sh

# Или вручную
docker-compose up -d postgres
```

### **2. Запуск backend:**

```bash
cd backend
cp env.local .env
npm install
npm run start:dev
```

### **3. Запуск frontend:**

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Настройки

### **Локальная PostgreSQL:**

- **Host:** localhost:5432
- **Database:** porfolio_dev
- **User:** postgres
- **Password:** password123
- **URL:** postgresql://postgres:password123@localhost:5432/porfolio_dev

### **Порты:**

- **Frontend:** http://localhost:3001
- **Backend:** http://localhost:3000
- **PostgreSQL:** localhost:5432

## 🗄️ Управление базой данных

### **Подключение через psql:**

```bash
psql -h localhost -p 5432 -U postgres -d porfolio_dev
# Пароль: password123
```

### **Подключение через GUI клиенты:**

- **pgAdmin:** http://localhost:5432
- **DBeaver, TablePlus, etc.**

### **Полезные команды:**

```bash
# Смотреть логи PostgreSQL
docker-compose logs postgres

# Перезапустить базу данных
docker-compose restart postgres

# Остановить все
docker-compose down

# Удалить данные базы (ОСТОРОЖНО!)
docker-compose down -v
```

## 🧪 Тестирование

### **API Endpoints:**

- GET http://localhost:3000 - "Hello World!"
- POST http://localhost:3000/auth/login
- POST http://localhost:3000/auth/register
- GET http://localhost:3000/auth/profile

### **Тестовые пользователи:**

- john@example.com / password123
- admin@example.com / admin123

## ❌ Проблемы и решения

### **PostgreSQL не запускается:**

```bash
# Убедись что порт 5432 свободен
sudo lsof -i :5432

# Перезапуск Docker
sudo systemctl restart docker
```

### **Ошибки подключения к базе:**

1. Проверь что PostgreSQL контейнер запущен: `docker-compose ps`
2. Проверь .env файл в backend/
3. Проверь что порт 5432 доступен

### **Сброс базы данных:**

```bash
docker-compose down -v  # Удаляет данные
docker-compose up -d postgres  # Создает заново
```

## 🔄 Синхронизация с продакшеном

Локальная база данных **независима** от продакшен базы в Railway.

- Локально: тестовые данные
- Продакшн: реальные пользователи

Для синхронизации можно использовать pg_dump/pg_restore.
