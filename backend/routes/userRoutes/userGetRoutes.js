const express = require('express');
const router = express.Router();
const userControllerGet = require('../../controllers/userControllers/userControllerGet');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkUserRole = keycloak.protect('realm:user');

router.get('/user/reservations', checkUserRole, userControllerGet.getUserReservations);
router.get('/user/reservations/:reservation_id', checkUserRole, userControllerGet.getUserReservation);
router.get('/occupied', checkUserRole, userControllerGet.occupied);

module.exports = router;