const express = require('express')
const cors = require('cors');
const logger = require('pino')();
require('dotenv').config();
const { keycloak, exported_session, getUserInfoFromTokenHeader } = require('./auth/auth.js');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')

const roomGetRoutes = require('./routes/roomRoutes/roomGetRoutes.js');
const deskGetRoutes = require('./routes/deskRoutes/deskGetRoutes.js');
const reservationGetRoutes = require('./routes/reservationRoutes/reservationGetRoutes.js');

const roomPostRoutes = require('./routes/roomRoutes/roomPostRoutes.js');
const deskPostRoutes = require('./routes/deskRoutes/deskPostRoutes.js');
const reservationPostRoutes = require('./routes/reservationRoutes/reservationPostRoutes.js');

const roomDeleteRoutes = require('./routes/roomRoutes/roomDeleteRoutes.js');
const deskDeleteRoutes = require('./routes/deskRoutes/deskDeleteRoutes.js');
const reservationDeleteRoutes = require('./routes/reservationRoutes/reservationDeleteRoutes.js');


const routes = [roomGetRoutes, deskGetRoutes, reservationGetRoutes, roomPostRoutes, deskPostRoutes, reservationPostRoutes, roomDeleteRoutes, deskDeleteRoutes, reservationDeleteRoutes];

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
  origin: ['http://localhost:5173', 'http://192.168.100.179:5173'],
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