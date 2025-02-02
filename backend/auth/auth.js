const session = require('express-session');
const Keycloak = require('keycloak-connect');
const dotenv = require('dotenv').config({path: '../.env'});
const Users = require("../database/models").Users;
const axios = require('axios');
const qs = require('qs');
const KeycloakAdminClient = require('@keycloak/keycloak-admin-client').default;

const memoryStore = new session.MemoryStore();

const kcConfig = {
    "realm": process.env.KEYCLOAK_REALM,
    "auth-server-url": process.env.KEYCLOAK_URL,
    "ssl-required": "external",
    "resource": process.env.KEYCLOAK_CLIENT,
    "credentials": {
      "secret": process.env.KEYCLOAK_SECRET
    },
    "confidential-port": 0,
    "policy-enforcer": {
      "credentials": {}
    }
};

const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

exported_session = session({
    secret: process.env.APP_SECRET ,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
})

const parseToken = raw => {
  if (!raw || typeof raw !== 'string') return null;

  try {
      raw = JSON.parse(raw);
      const token = raw.id_token ? raw.id_token : raw.access_token;
      const content = token.split('.')[1];

      return JSON.parse(Buffer.from(content, 'base64').toString('utf-8'));
  } catch (e) {
      console.error('Error while parsing token: ', e);
  }
};  

async function syncNewUsers() {

  const kcAdminClient = new KeycloakAdminClient({
    baseUrl: process.env.KEYCLOAK_URL,
    realmName: process.env.KEYCLOAK_CLIENT
  });

  try {
    await kcAdminClient.auth({
      username: process.env.KEYCLOAK_CLI_ADMIN,
      password: process.env.KEYCLOAK_CLI_ADMIN_PASS,
      grantType: 'password',
      clientId: 'admin-cli'
    });

    // Fetch all users
    const users = await kcAdminClient.users.find();

    //Add only users which are not in database
    for (let user of users) {
      const userExists = await Users.findOne({where: {email: user.email}});
      if (!userExists) {
        await Users.create({
          username: user.username,
          email: user.email,
        });
        console.log('User added:', user.email);
      }
    }

  } catch (error) {
    console.error('User sync failed:', error);
  }
}

//Get user token
async function getTestUserToken(username, password) {
  try {
    const tokenUrl = process.env.KEYCLOAK_URL  + '/realms/' + process.env.KEYCLOAK_CLIENT + '/protocol/openid-connect/token';
    
    const data = qs.stringify({
      'grant_type': 'password',
      'client_id': process.env.KEYCLOAK_CLIENT,
      'client_secret': process.env.KEYCLOAK_SECRET,
      'username': username,
      'password': password
    });

    const response = await axios.post(tokenUrl, data, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Token:', response.data.access_token);

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {keycloak, memoryStore, exported_session, parseToken, syncNewUsers, getTestUserToken};