#!/bin/sh

MIGRATION_FLAG="/desk-manager-backend/ran_migrations/migrations_applied"

if [ ! -f "$MIGRATION_FLAG" ]; then
  echo "Running migrations..."
  cd database && npx sequelize db:migrate && npx sequelize-cli db:seed:all && cd ..
  touch "$MIGRATION_FLAG"
else
  echo "Migrations already applied."
fi

npm run dev