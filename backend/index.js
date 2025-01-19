const express = require('express')
const db = require('./database/database.js');
const adminGetRoutes = require('./routes/adminGetRoutes');
const adminPostRoutes = require('./routes/adminPostRoutes');

const app = express()
const port = 3000


app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
app.use(adminGetRoutes);
app.use(adminPostRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})