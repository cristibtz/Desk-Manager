const express = require('express')
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const db = require('./database/database.js');
const cors = require('cors');
require('dotenv').config();
const { keycloak, exported_session, syncNewUsers, getUserInfoFromTokenHeader } = require('./auth/auth.js');

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
}));

//CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.100.179:5173'],
  credentials: true
}));

//Routes
app.use(routes);

app.get('/', keycloak.protect(), async (req, res) => {

  userInfo = await getUserInfoFromTokenHeader(req);

  const name = userInfo.name;
  const role = userInfo.roles.includes('admin') ? 'admin' : 'user';

  res.status(200).render('home', {role: role, name: name});
});


app.get('/userinfo', keycloak.protect(), async (req, res) => {

  userInfo = await getUserInfoFromTokenHeader(req);

  res.status(200).send(JSON.stringify(userInfo, null, 2)); 
});

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})