const express = require('express');
const router = express.Router();
const roomControllersGet = require('../../controllers/roomControllers/roomControllersGet.js');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const allRoles = keycloak.protect('realm:user', 'realm:admin');

//Rooms routes
router.get('/rooms/', allRoles, roomControllersGet.getRooms);
router.get('/rooms/:room_number', allRoles, roomControllersGet.getRoom);
router.get('/rooms/:room_id/desks', allRoles, roomControllersGet.getRoomDesks);

module.exports = router;