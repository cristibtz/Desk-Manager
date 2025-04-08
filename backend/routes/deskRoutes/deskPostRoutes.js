const express = require('express');
const router = express.Router();
const deskControllersPost = require('../../controllers/deskControllers/deskControllersPost');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');


router.post('/desks', checkAdminRole, deskControllersPost.createDesk);
router.post('/desks/:desk_id', checkAdminRole, deskControllersPost.updateDesk);

module.exports = router;