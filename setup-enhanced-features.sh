#!/bin/bash

echo "🚀 Setting up enhanced Jira clone features..."

# Navigate to API directory
cd api

echo "📦 Installing new dependencies..."
npm install bcryptjs@^2.4.3 @types/bcryptjs@^2.4.2

echo "🗄️ Setting up database migrations..."
echo "TypeORM configuration has been updated to use migrations"
echo "Running database migrations..."
npm run migration:run

echo "🌱 Seeding default roles..."
echo "Running database seeds..."
npm run seed

echo "✅ Setup complete!"
echo ""
echo "📋 New features added:"
echo "   ✓ Email/Password Authentication"
echo "   ✓ Role-based Permission System"
echo "   ✓ Notification System"
echo "   ✓ Time Tracking"
echo "   ✓ Database Migrations"
echo ""
echo "🔧 Next steps:"
echo "   1. Update your .env file with JWT_SECRET if not already set"
echo "   2. Configure TypeORM to use migrations"
echo "   3. Run database migrations"
echo "   4. Seed default roles"
echo "   5. Update your frontend to use the new authentication endpoints"
echo ""
echo "📚 New API endpoints:"
echo "   POST /authentication/register"
echo "   POST /authentication/login"
echo "   GET /notifications"
echo "   POST /time-logs"
echo "   GET /time-logs/report"
echo "   And many more..."