#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."
# Wait for PostgreSQL to be ready - adjust the host and port if needed
npx wait-on -t 60000 tcp:postgres:5432

echo "🔄 Running Prisma DB Push..."
npx prisma db push

echo "✅ Database initialized successfully!"

# If you want to also seed the database
if [ "$DB_SEED" = "true" ]; then
  echo "🌱 Seeding database..."
  npx prisma db seed
fi

# Execute the main container command (typically starting Next.js)
exec "$@"