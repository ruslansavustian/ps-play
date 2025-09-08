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

### 🔐 **Authentication & Security**

- Complete login/register system with JWT
- Secure token-based authentication
- Password hashing with bcrypt
- Protected API routes with role-based access
- Input validation on both frontend and backend
- CORS configuration for secure communication

### 👤 **User Management**

- Protected dashboard with comprehensive account management
- User role management (Admin, User)
- Profile management and settings
- Audit logging for all user operations

### 🎮 **Gaming Account Management**

- Create, view, edit, and manage gaming accounts
- Support for PlayStation (PS4/PS5), Xbox, Steam, Epic Games
- Multiple pricing tiers (Offline/Online activation, Rental)
- Account verification and status tracking
- Game library and achievements management

### 💬 **Real-time Communication**

- WebSocket-based chat system for customer support
- AI-powered assistant with OpenAI integration
- Real-time notifications and updates
- Live order status updates

### 🤖 **AI & Automation**

- OpenAI GPT integration for customer assistance
- Automated order processing and recommendations
- Telegram bot for notifications and interactions
- Smart account matching based on user requirements

### 🛒 **Order Management**

- Complete order processing and tracking
- Multiple purchase types and platforms
- Order history and status management
- Customer information management

### 🎨 **Modern UI/UX**

- Beautiful components with HeroUI and Tailwind CSS
- Responsive design for all devices
- Smooth animations with Framer Motion
- Internationalization support (EN/UA/RU)
- Dark/Light theme support
- Interactive widgets with pulsing animations

### 🗄️ **Data & Storage**

- PostgreSQL database with TypeORM
- Redis caching for performance
- AWS S3 integration for file storage
- Database migrations and versioning

### 🧪 **Development & Testing**

- Jest testing framework configured
- ESLint and Prettier for code quality
- Docker support for containerized deployment
- API documentation with Swagger
- TypeScript for full type safety

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
- **React 19.1.0** - UI library with latest features
- **TypeScript 5** - Full type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **HeroUI 2.8.2** - Modern React component library
- **Framer Motion 12.23.12** - Smooth animations and transitions
- **React Hook Form 7.62.0** - Advanced form handling and validation
- **Zod 4.0.17** - Schema validation and type inference
- **Axios 1.11.0** - HTTP client with interceptors
- **Socket.io Client 4.8.1** - Real-time WebSocket communication
- **Moment.js 2.30.1** - Date and time manipulation
- **Crypto-js 4.2.0** - Cryptographic functions for security
- **Lucide React 0.540.0** - Beautiful icon library
- **next-intl 4.3.5** - Internationalization (i18n) support
- **@react-stately/data 3.14.0** - State management for UI components
- **@hookform/resolvers 5.2.1** - Form validation resolvers
- **flag-icons 7.5.0** - Country flag icons for i18n

### Backend

- **NestJS 11.0.1** - Node.js framework with decorators and dependency injection
- **TypeScript 5.7.3** - Full type safety
- **PostgreSQL** - Primary relational database
- **TypeORM 0.3.25** - Advanced ORM with migrations and relations
- **Redis** - Caching and session storage
- **JWT** - JSON Web Token authentication
- **Passport 0.7.0** - Authentication middleware
- **Passport JWT 4.0.1** - JWT strategy for Passport
- **Passport Local 1.0.0** - Local strategy for Passport
- **bcrypt 6.0.0** - Secure password hashing
- **class-validator 0.14.2** - DTO validation with decorators
- **class-transformer 0.5.1** - Object transformation and serialization
- **Swagger 11.2.0** - Auto-generated API documentation
- **Socket.io 4.8.1** - Real-time WebSocket communication
- **OpenAI 5.19.1** - AI integration for customer assistance
- **Node Telegram Bot API 0.66.0** - Telegram bot integration
- **AWS SDK 3.879.0** - S3 file storage integration
- **Crypto-js 4.2.0** - Cryptographic functions for security
- **UUID 11.1.0** - Unique identifier generation
- **Multer 2.0.2** - File upload handling
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

- **PostgreSQL** - Primary relational database
- **Redis** - Caching and session storage
- **Docker & Docker Compose** - Containerization and orchestration
- **TypeORM** - Advanced ORM with migrations and relations
- **Database migrations** - Schema versioning and management
- **AWS S3** - Cloud file storage and management

### Current State Management

- **React Context API** - Global state management with useReducer
- **Custom hooks** - Reusable state logic (useChat, useAiChat)
- **Local storage** - Client-side data persistence
- **Session management** - JWT token handling and refresh

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

## 🚀 Future Roadmap

### 🔄 **State Management Enhancement**

- **Redux Toolkit** or **Zustand** - Replace current Context API with more scalable state management
- **React Query/TanStack Query** - Advanced server state management and caching
- **Optimistic updates** - Better UX with immediate UI feedback

### 💳 **Payment Integration**

- **Stripe** or **PayPal** - Secure payment processing
- **Crypto payments** - Bitcoin, Ethereum, and other cryptocurrencies
- **Multi-currency support** - USD, EUR, UAH, RUB
- **Subscription models** - Recurring payments for premium features
- **Payment analytics** - Revenue tracking and reporting

### 🎯 **Advanced Features**

- **Real-time notifications** - Push notifications for orders and updates
- **Advanced search & filtering** - Elasticsearch integration for better search
- **Recommendation engine** - ML-based account recommendations
- **Inventory management** - Automated stock tracking and alerts
- **Analytics dashboard** - Business intelligence and reporting

### 🔧 **Technical Improvements**

- **Generic interfaces** - Optimize TypeScript interfaces with generics
- **Microservices architecture** - Split into smaller, focused services
- **GraphQL API** - More efficient data fetching
- **Progressive Web App (PWA)** - Offline support and mobile app-like experience
- **Performance optimization** - Code splitting, lazy loading, and caching strategies

### 🛡️ **Security & Compliance**

- **Two-factor authentication (2FA)** - Enhanced security
- **Rate limiting** - API protection against abuse
- **GDPR compliance** - Data protection and privacy
- **Security auditing** - Regular security assessments
- **Backup & disaster recovery** - Automated backups and recovery procedures

### 🌐 **Scalability & Infrastructure**

- **Kubernetes deployment** - Container orchestration
- **CDN integration** - Global content delivery
- **Database optimization** - Query optimization and indexing
- **Load balancing** - High availability and performance
- **Monitoring & logging** - Comprehensive observability

### 🎮 **Gaming Platform Expansion**

- **More gaming platforms** - Nintendo Switch, Mobile games, etc.
- **Account verification system** - Automated account validation
- **Game library integration** - Direct API connections to gaming platforms
- **Achievement tracking** - Gamification features
- **Community features** - User reviews and ratings

### 🤖 **AI & Automation**

- **Advanced AI features** - Image recognition, natural language processing
- **Automated customer support** - Chatbot with more capabilities
- **Predictive analytics** - Demand forecasting and pricing optimization
- **Smart matching** - AI-powered account recommendations
- **Voice interface** - Voice commands and interactions

## 💡 **Recommended Next Steps**

### **High Priority (Next 1-2 months)**

1. **Payment Integration** - Implement Stripe for secure transactions
2. **State Management Migration** - Move from Context API to Zustand or Redux Toolkit
3. **Generic TypeScript Interfaces** - Optimize type definitions with generics
4. **Performance Optimization** - Implement code splitting and lazy loading

### **Medium Priority (Next 3-6 months)**

1. **Advanced Search** - Implement Elasticsearch for better search capabilities
2. **Real-time Notifications** - Add push notifications and email alerts
3. **Analytics Dashboard** - Business intelligence and reporting features
4. **Mobile App** - React Native or PWA implementation

### **Long-term Goals (6+ months)**

1. **Microservices Architecture** - Split into focused services
2. **AI Enhancement** - Advanced ML features and recommendations
3. **International Expansion** - Multi-language and multi-currency support
4. **Community Features** - User reviews, ratings, and social features

### **Technical Debt & Improvements**

- **Testing Coverage** - Increase test coverage to 80%+
- **Documentation** - Comprehensive API and component documentation
- **Error Handling** - Centralized error handling and logging
- **Accessibility** - WCAG compliance and screen reader support
- **SEO Optimization** - Meta tags, structured data, and performance

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## Local Development

See `LOCAL_DEVELOPMENT.md` for detailed local development setup.

## License

This project is licensed under the MIT License.
