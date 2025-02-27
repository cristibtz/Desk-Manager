const express = require('express');
const router = express.Router();
const userControllerPost = require('../../controllers/userControllers/userControllerPost');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkUserRole = keycloak.protect('realm:user');

router.post('/user/reservations', checkUserRole, userControllerPost.createReservation);
router.post('/user/reservations/:reservation_id', checkUserRole, userControllerPost.updateReservation);

module.exports = router;