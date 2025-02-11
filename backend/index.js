const express = require('express')
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const db = require('./database/database.js');
require('dotenv').config();
const { keycloak, exported_session, parseToken, syncNewUsers } = require('./auth/auth.js');

const adminGetRoutes = require('./routes/adminRoutes/adminGetRoutes');
const adminPostRoutes = require('./routes/adminRoutes/adminPostRoutes');
const adminDeleteRoutes = require('./routes/adminRoutes/adminDeleteRoutes');
const userGetRoutes = require('./routes/userRoutes/userGetRoutes');
const userPostRoutes = require('./routes/userRoutes/userPostRoutes');
const userDeleteRoutes = require('./routes/userRoutes/userDeleteRoutes');

const routes = [adminDeleteRoutes, adminGetRoutes, adminPostRoutes, userDeleteRoutes, userGetRoutes, userPostRoutes];

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express()
const port = 3000

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//API Docs
app.use(express.urlencoded({extended: true}));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//Session
app.use(exported_session);

app.use( keycloak.middleware({ 
  logout: '/logout', 
  admin: '/admin',
}));

//Routes
app.use(routes);

//To do: delete /admin and /user routes and modify / route so that it handles admin and user role(to be done while integrating the frontend)

app.get('/', (req, res) => {

  //To sync the users when '/' is accessed
  syncNewUsers();

  res.status(200).render('landing');
});

app.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
  
  const details = parseToken(req.session['keycloak-token']);

  const name = details.preferred_username;
  const role = details.realm_access["roles"].includes('admin') ? 'admin' : 'user';
  res.status(200).render('admin', {role: role, name: name});

})

app.get('/user', keycloak.protect('realm:user'), (req, res) => {
  
  const details = parseToken(req.session['keycloak-token']);

  const name = details.preferred_username;
  const role = details.realm_access["roles"].includes('user') ? 'user' : '';
  res.status(200).render('user', {role: role, name: name});
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})