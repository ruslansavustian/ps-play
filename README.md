# PS-Play - Gaming Accounts Marketplace

A modern full-stack gaming accounts marketplace built with Next.js (frontend) and NestJS (backend) featuring user authentication and account management.

## Project Structure

```
ps-play/
├── frontend/          # Next.js React frontend
└── backend/           # NestJS API backend
```

## Features

- 🔐 **User Authentication** - Complete login/register system
- 👤 **User Dashboard** - Protected dashboard with account management
- 🎮 **Gaming Account Management** - Create, view, and manage gaming accounts
- 🎨 **Modern UI** - Beautiful components with HeroUI and Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔒 **JWT Authentication** - Secure token-based authentication
- ✅ **Form Validation** - Client and server-side validation with Zod
- 🚀 **TypeScript** - Full type safety across frontend and backend
- 🎭 **Smooth Animations** - Enhanced UX with Framer Motion
- 📚 **API Documentation** - Auto-generated Swagger documentation
- 🗄️ **Database Integration** - PostgreSQL with TypeORM
- 🧪 **Testing Ready** - Jest testing framework configured

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn
- PostgreSQL database

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ps-play
   ```

2. **Setup Database**

   Create a new PostgreSQL database for ps-play:

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
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## Technology Stack

### Frontend

- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **HeroUI 2.8.2** - Modern React component library
- **Framer Motion 12.23.12** - Animations and transitions
- **React Hook Form 7.62.0** - Form handling and validation
- **Zod 4.0.17** - Schema validation
- **Axios 1.11.0** - HTTP client for API requests
- **Lucide React 0.540.0** - Icon library

### Backend

- **NestJS 11.0.1** - Node.js framework with decorators
- **TypeScript 5.7.3** - Type safety
- **PostgreSQL** - Primary database
- **TypeORM 0.3.25** - ORM for database operations
- **JWT** - JSON Web Token authentication
- **Passport 0.7.0** - Authentication middleware
- **Passport JWT 4.0.1** - JWT strategy for Passport
- **bcrypt 6.0.0** - Password hashing
- **class-validator 0.14.2** - DTO validation
- **class-transformer 0.5.1** - Object transformation
- **Swagger 11.2.0** - API documentation
- **Jest 30.0.0** - Testing framework

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **ts-node** - TypeScript execution
- **Nodemon** - Development server auto-reload

## Gaming Account Features

### Supported Game Types

- PlayStation accounts
- Xbox accounts
- Steam accounts
- Epic Games accounts
- And more...

### Account Properties

- Game platform (PlayStation, Xbox, Steam, etc.)
- Account username/email
- Account level/rank
- Game library/achievements
- Account status (available, sold, reserved)
- Price and payment methods
- Account verification status

### Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation on both frontend and backend
- CORS configuration for frontend-backend communication
- Account ownership verification

## License

This project is licensed under the MIT License.
