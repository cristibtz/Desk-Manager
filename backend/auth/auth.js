const session = require('express-session');
const Keycloak = require('keycloak-connect');
const dotenv = require('dotenv').config({path: '../.env'});

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

module.exports = {keycloak, memoryStore, exported_session, parseToken};