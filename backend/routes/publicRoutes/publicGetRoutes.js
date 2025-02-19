const express = require('express');
const router = express.Router();
const publicControllerGet = require('../../controllers/publicControllers/publicControllerGet.js');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const allRoles = keycloak.protect('realm:user', 'realm:admin');

//Rooms routes
router.get('/rooms/', allRoles, publicControllerGet.getRooms);
router.get('/rooms/:room_number', allRoles, publicControllerGet.getRoom);
router.get('/rooms/:room_id/desks', allRoles, publicControllerGet.getRoomDesks);


//Desks routes
router.get('/desks/', allRoles, publicControllerGet.getDesks);
router.get('/desks/:desk_id', allRoles, publicControllerGet.getDesk);

module.exports = router;