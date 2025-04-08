require("dotenv").config();
const {Client} = require('pg');

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  
module.exports = client;