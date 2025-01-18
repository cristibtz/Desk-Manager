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
npm install express # More dependencies to be added here...
npm install nodemon -D # For development purposes
```
Add this to package.json scripts section:
```
"start": "nodejs index.js",
"dev": "nodemon index.js"
```
Run with `npm run dev`
