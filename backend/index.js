const express = require('express')
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const db = require('./database/database.js');
const adminGetRoutes = require('./routes/adminRoutes/adminGetRoutes');
const adminPostRoutes = require('./routes/adminRoutes/adminPostRoutes');
const adminDeleteRoutes = require('./routes/adminRoutes/adminDeleteRoutes');
const userGetRoutes = require('./routes/userRoutes/userGetRoutes');
const userPostRoutes = require('./routes/userRoutes/userPostRoutes');
const userDeleteRoutes = require('./routes/userRoutes/userDeleteRoutes');

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express()
const port = 3000


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//Routes
app.use(adminGetRoutes);
app.use(adminPostRoutes);
app.use(adminDeleteRoutes);

app.use(userGetRoutes);
app.use(userPostRoutes);
app.use(userDeleteRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})