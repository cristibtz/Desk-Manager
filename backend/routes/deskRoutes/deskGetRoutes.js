const express = require('express');
const router = express.Router();
const deskControllersGet = require('../../controllers/deskControllers/deskControllersGet.js');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const allRoles = keycloak.protect('realm:user', 'realm:admin');

//Desks routes
router.get('/desks/', allRoles, deskControllersGet.getDesks);
router.get('/desks/:desk_id', allRoles, deskControllersGet.getDesk);

module.exports = router;