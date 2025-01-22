const express = require('express')
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const db = require('./database/database.js');
require('dotenv').config();
const { keycloak, exported_session, parseToken } = require('./auth/auth.js');

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

//API Docs
app.use(express.urlencoded({extended: true}));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//Routes
app.use(routes);

//Session
app.use(exported_session);

app.use( keycloak.middleware({ 
  logout: '/logout', 
  admin: '/admin',
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
  
  const details = parseToken(req.session['keycloak-token']);
  let response = 'Hello World! You are logged in as an admin with the following details:<br>';

  if (details) {
    for (const [key, value] of Object.entries(details)) {
      response += `${key}: ${JSON.stringify(value)}<br>`;
    }
  } else {
    response += 'No token details available.';
  }
  
  res.send(response);

})

app.get('/user', keycloak.protect('realm:user'), (req, res) => {
  const details = parseToken(req.session['keycloak-token']);
  let response = 'Hello World! You are logged in as a user with the following details:<br>';

  if (details) {
    for (const [key, value] of Object.entries(details)) {
      response += `${key}: ${JSON.stringify(value)}<br>`;
    }
  } else {
    response += 'No token details available.';
  }
  
  res.send(response);
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})