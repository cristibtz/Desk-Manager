const express = require('express')
const cors = require('cors');
const logger = require('pino')();
require('dotenv').config();
const { keycloak, exported_session, getUserInfoFromTokenHeader } = require('./auth/auth.js');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')

const userGetRoutes = require('./routes/userRoutes/userGetRoutes.js');

const roomGetRoutes = require('./routes/roomRoutes/roomGetRoutes.js');
const deskGetRoutes = require('./routes/deskRoutes/deskGetRoutes.js');
const reservationGetRoutes = require('./routes/reservationRoutes/reservationGetRoutes.js');

const roomPostRoutes = require('./routes/roomRoutes/roomPostRoutes.js');
const deskPostRoutes = require('./routes/deskRoutes/deskPostRoutes.js');
const reservationPostRoutes = require('./routes/reservationRoutes/reservationPostRoutes.js');

const roomDeleteRoutes = require('./routes/roomRoutes/roomDeleteRoutes.js');
const deskDeleteRoutes = require('./routes/deskRoutes/deskDeleteRoutes.js');
const reservationDeleteRoutes = require('./routes/reservationRoutes/reservationDeleteRoutes.js');


const routes = [userGetRoutes, roomGetRoutes, deskGetRoutes, reservationGetRoutes, roomPostRoutes, deskPostRoutes, reservationPostRoutes, roomDeleteRoutes, deskDeleteRoutes, reservationDeleteRoutes];

const app = express()
const port = 3000

app.use(express.json());

//API Docs
app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//Session
app.use(exported_session);

app.use( keycloak.middleware({ 
  logout: '/logout', 
}));

//CORS
app.use(cors({
  origin: ['http://192.168.100.179:5173', 'http://192.168.100.179', 
           'http://192.168.100.171','http://192.168.100.171:5173',
           'http://192.168.131.33:5173', 'http://192.168.131.33',
           'http://10.227.0.13:5173', 'http://10.227.0.13',
           'http://desk-manager.cbranet.academy.dvloper.io',
           'https://desk-manager.cbranet.academy.dvloper.io'],
  credentials: true
}));

//Routes
app.use(routes);

app.get('/userinfo', keycloak.protect(), async (req, res) => {

  userInfo = await getUserInfoFromTokenHeader(req);

  logger.info(userInfo);

  res.status(200).send(JSON.stringify(userInfo, null, 2)); 
});

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})