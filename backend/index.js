const express = require('express')
const db = require('./database/database.js');
const adminRoutes = require('./routes/adminRoutes');

const app = express()
const port = 3000


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})