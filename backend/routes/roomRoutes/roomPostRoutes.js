const express = require('express');
const router = express.Router();
const roomControllersPost = require('../../controllers/roomControllers/roomControllersPost');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

router.post('/rooms', checkAdminRole, roomControllersPost.createRoom);
router.post('/rooms/:room_number', checkAdminRole, roomControllersPost.updateRoom);

module.exports = router;