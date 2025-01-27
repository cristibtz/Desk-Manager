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
APP_URL="http://IP"

TEST_USER="tester"
TEST_PASS=whatever

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
1. Make sure the .env file has all the proper fields

2. Docker command to run Keycloak
```
docker run -d --name keycloak -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.1.0 start-dev
```
3. Go to http://IP:8080
4. Login with admin credentials
5. Create new realm called `resource-manager`

![photo](photos/keycloak-1.png)

6.  Then modify the info needed for register/login: Go to Realm settings > User Profile > Delete lastName and firstName

![photo](photos/keycloak-2.png)

7. Create two realm roles: admin and user
8. Creating `resource-manager` client
* Client authentication and Authorization enabled
* Add the IP address of your development server or if localhost(depends on the case)

![photo](photos/keycloak-3.png)

9. Create a client scope called `resource-manager`, then add a mapper to that scope which has the `Included Client Audience` as `resource-manager`
10. Add the scope to the `resource-manager` Client
11. Get the secret key from the adapter config of the client and add it to the .env file 

![photo](photos/keycloak-4.png)

12. Add realm and client role mappers to the `resource-manager` client scope and enable to be added to userinfo. In this way we can see their roles in the access token. 
13. Add the `view-users` role to the admin role and the `user` role to the defaults role.
14. Create a user and assign him admin and user roles, then test the `/admin` and `/user` endpoints.

# Testing approach