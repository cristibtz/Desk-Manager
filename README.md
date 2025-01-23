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
APP_SECRET=secret
KEYCLOAK_REALM="resource-manager"
KEYCLOAK_CLIENT="resource-manager"
KEYCLOAK_URL="http://localhost:8080/"
KEYCLOAK_SECRET="secret_from_the_oidc_json_file"
KEYCLOAK_CLI_ADMIN="admin_user_of_the_resource-manager_app"
KEYCLOAK_CLI_ADMIN_PASS=whatever
```
>The user which will access Keycloak via admin-cli must have view-users role assigned

Create tables and use dummy data:
```
cd database
npx sequelize-cli db:migrate # Migration
npx sequelize-cli db:seed:all # Dummy data
```

# Summary of the API endpoints of the app and their purpose

>Admin endpoints
![photo](photos/photo-1.png)

>User endpoints
![photo](photos/photo-2.png)

# Authentication server setup

Docker command to run Keycloak
```
docker run -d --name keycloak -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.1.0 start-dev
```
