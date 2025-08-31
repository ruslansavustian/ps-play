# PS-Play - Gaming Accounts Marketplace

A modern full-stack gaming accounts marketplace built with Next.js (frontend) and NestJS (backend) featuring user authentication, real-time chat, and comprehensive account management.

## Project Structure

```
ps-play/
├── frontend/          # Next.js React frontend
├── backend/           # NestJS API backend
├── scripts/           # Development and deployment scripts
├── init.sql/          # Database initialization scripts
├── docker-compose.yml # Docker configuration
└── docker-compose.database.yml # Database Docker setup
```

## Features

- 🔐 **User Authentication** - Complete login/register system with JWT
- 👤 **User Dashboard** - Protected dashboard with comprehensive account management
- 🎮 **Gaming Account Management** - Create, view, edit, and manage gaming accounts
- 💬 **Real-time Chat System** - WebSocket-based chat for customer support
- 🤖 **Telegram Bot Integration** - Automated notifications and interactions
- 📊 **Audit Logging** - Complete activity tracking and logging
- 🛒 **Order Management** - Customer order processing and tracking
- 🎨 **Modern UI** - Beautiful components with HeroUI and Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔒 **JWT Authentication** - Secure token-based authentication
- ✅ **Form Validation** - Client and server-side validation with Zod
- 🚀 **TypeScript** - Full type safety across frontend and backend
- 🎭 **Smooth Animations** - Enhanced UX with Framer Motion
- 📚 **API Documentation** - Auto-generated Swagger documentation
- 🗄️ **Database Integration** - PostgreSQL with TypeORM
- 🧪 **Testing Ready** - Jest testing framework configured
- 🐳 **Docker Support** - Containerized development and deployment
- 📱 **Mobile Responsive** - Optimized for mobile devices

## Quick Start

### Prerequisites

- Node.js 20+ (required)
- npm 10+ (required)
- PostgreSQL database
- Docker & Docker Compose (optional, for database)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ps-play
   ```

2. **Setup Database** (Choose one option)

   **Option A: Using Docker (Recommended)**

   ```bash
   docker-compose -f docker-compose.database.yml up -d
   ```

   **Option B: Manual PostgreSQL setup**

   ```sql
   CREATE DATABASE psplay_db;
   ```

3. **Setup Backend**

   ```bash
   cd backend
   npm install
   # Copy and configure your environment variables
   cp env.template .env
   npm run start:dev
   ```

   Backend will run on http://localhost:3000

4. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:3001

### Default Ports

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- PostgreSQL: 5432 (if using Docker)

## API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Gaming Accounts

- `GET /accounts` - Get all gaming accounts (protected)
- `POST /accounts` - Create new gaming account (protected)
- `GET /accounts/:id` - Get account by ID (protected)
- `PUT /accounts/:id` - Update gaming account (protected)
- `DELETE /accounts/:id` - Delete gaming account (protected)
- `GET /accounts/public` - Get public accounts (unprotected)

### Orders

- `GET /orders` - Get all orders (protected)
- `POST /orders` - Create new order (protected)
- `PUT /orders/:id` - Update order (protected)
- `DELETE /orders/:id` - Delete order (protected)

### Games

- `GET /games` - Get all games (protected)
- `POST /games` - Create new game (protected)
- `PUT /games/:id` - Update game (protected)
- `DELETE /games/:id` - Delete game (protected)

### Audit Logs

- `GET /audit-logs` - Get audit logs (protected)
- `POST /audit-logs` - Create audit log entry (protected)

### Chat (WebSocket)

- WebSocket connection for real-time chat
- Support for customer service interactions

### API Documentation

- `GET /api` - Swagger API documentation (available in development)

## Environment Variables

### Backend (.env)

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=psplay_db
JWT_SECRET=your-secret-key
PORT=3000
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development

### Backend Development

```bash
cd backend
npm run start:dev    # Start in development mode
npm run build        # Build for production
npm run start:prod   # Start in production mode
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management

```bash
# Using Docker
docker-compose -f docker-compose.database.yml up -d
docker-compose -f docker-compose.database.yml down

# Database initialization
psql -U your_user -d psplay_db -f init.sql/init.sql
```

## Technology Stack

### Frontend

- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **HeroUI 2.8.2** - Modern React component library
- **Framer Motion 12.23.12** - Animations and transitions
- **React Hook Form 7.62.0** - Form handling and validation
- **Zod 4.0.17** - Schema validation
- **Axios 1.11.0** - HTTP client for API requests
- **Socket.io Client 4.8.1** - Real-time communication
- **Moment.js 2.30.1** - Date and time manipulation
- **Crypto-js 4.2.0** - Cryptographic functions
- **Lucide React 0.540.0** - Icon library
- **@react-stately/data 3.14.0** - State management for UI components

### Backend

- **NestJS 11.0.1** - Node.js framework with decorators
- **TypeScript 5.7.3** - Type safety
- **PostgreSQL** - Primary database
- **TypeORM 0.3.25** - ORM for database operations
- **JWT** - JSON Web Token authentication
- **Passport 0.7.0** - Authentication middleware
- **Passport JWT 4.0.1** - JWT strategy for Passport
- **Passport Local 1.0.0** - Local strategy for Passport
- **bcrypt 6.0.0** - Password hashing
- **class-validator 0.14.2** - DTO validation
- **class-transformer 0.5.1** - Object transformation
- **Swagger 11.2.0** - API documentation
- **Socket.io 4.8.1** - Real-time WebSocket communication
- **Node Telegram Bot API 0.66.0** - Telegram bot integration
- **Crypto-js 4.2.0** - Cryptographic functions
- **UUID 11.1.0** - Unique identifier generation
- **Jest 30.0.0** - Testing framework

### Development Tools

- **ESLint 9** - Code linting
- **Prettier 3.4.2** - Code formatting
- **PostCSS** - CSS processing
- **ts-node 10.9.2** - TypeScript execution
- **Nodemon** - Development server auto-reload
- **Docker & Docker Compose** - Containerization
- **Rimraf 3.0.2** - Cross-platform file deletion

### Database & Infrastructure

- **PostgreSQL** - Primary database
- **Docker** - Containerization
- **TypeORM** - Database ORM
- **Database migrations** - Schema versioning

## Gaming Account Features

### Supported Game Types

- PlayStation accounts (PS4/PS5)
- Xbox accounts
- Steam accounts
- Epic Games accounts
- And more...

### Account Properties

- Game platform (PlayStation, Xbox, Steam, etc.)
- Game title and version
- Account username/email
- Account level/rank
- Game library/achievements
- Account status (available, sold, reserved)
- Multiple pricing tiers:
  - Offline activation
  - Online activation (PS4/PS5)
  - No activation required
  - Rental options
- Account verification status

### Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation on both frontend and backend
- CORS configuration for frontend-backend communication
- Account ownership verification
- Audit logging for all operations
- Cryptographic functions for sensitive data

### Real-time Features

- WebSocket-based chat system
- Real-time notifications
- Live order updates
- Customer support integration

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## Local Development

See `LOCAL_DEVELOPMENT.md` for detailed local development setup.

## License

This project is licensed under the MIT License.
