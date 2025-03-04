#!/bin/sh

MIGRATION_FLAG="/tmp/ran_migrations"

if [ ! -f "$MIGRATION_FLAG" ]; then
  echo "Running migrations..."
  cd database && npx sequelize db:migrate && npx sequelize-cli db:seed:all && cd ..
  touch "$MIGRATION_FLAG"
else
  echo "Migrations already applied."
fi

npm run dev