# Resource Manager

The project focuses on developing a "Resource Manager" application for managing shared resources such as meeting rooms or laboratory equipment.

# Repo setup for development
```
git clone git@gitlab.intranet.dvloper.io:mario.boro/resource-manager.git
git branch dev
git checkout dev
git push -u origin dev
```
# Project setup
```
cd backend
npm init -y
npm install # Installs all dependencies from package.json
```

Run with `npm run dev`

# Database setup
Postgres database should initially be ran with docker using:
`docker run --name app-db -e POSTGRES_USER="whatever" -e POSTGRES_PASSWORD="whatever" -e POSTGRES_DB="resource-manager" -p 5432:5432 postgres:latest`

Credentials will be read from a `.env` file which must be created in the `backend/` directory and should have the following fields:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=whatever
DB_PASS=whatever
DB_NAME=resource-manager
```
Create tables and use dummy data:
```
cd database
npx sequelize-cli db:migrate # Migration
npx sequelize-cli db:seed:all # Dummy data
```
