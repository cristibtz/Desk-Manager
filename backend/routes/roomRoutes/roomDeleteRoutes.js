const express = require('express');
const router = express.Router();
const roomControllersDelete = require('../../controllers/roomControllers/roomControllersDelete.js');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

router.delete('/rooms/:room_number', checkAdminRole, roomControllersDelete.deleteRoom);

module.exports = router;
