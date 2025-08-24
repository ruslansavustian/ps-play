#!/bin/bash

echo "🐳 Setting up local development environment..."

# Start PostgreSQL in Docker
echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is running
if docker-compose ps postgres | grep -q "Up"; then
    echo "✅ PostgreSQL is running on localhost:5432"
    echo "📊 Database: porfolio_dev"
    echo "👤 User: postgres"
    echo "🔑 Password: password123"
    echo ""
    echo "🚀 You can now run:"
    echo "   cd backend && cp env.local .env && npm run start:dev"
    echo "   cd frontend && npm run dev"
else
    echo "❌ Failed to start PostgreSQL"
    exit 1
fi