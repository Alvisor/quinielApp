# Prisma setup

This folder contains the Prisma schema and migration files.

1. Update the `.env` file at the project root with your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/quinieladb?schema=public"
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Apply migrations and generate the client (requires Prisma CLI):
   ```
   npx prisma migrate deploy
   npx prisma generate
   ```

The initial migration is in `migrations/0001_init/migration.sql`.
