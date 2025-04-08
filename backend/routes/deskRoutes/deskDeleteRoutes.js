const express = require('express');
const router = express.Router();
const deskControllersDelete = require('../../controllers/deskControllers/deskControllersDelete.js');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

router.delete('/desks/:desk_id', checkAdminRole, deskControllersDelete.deleteDesk);

module.exports = router;
