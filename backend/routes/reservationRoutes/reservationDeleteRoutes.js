const express = require('express');
const router = express.Router();
const reservationControllersDelete = require('../../controllers/reservationControllers/reservationControllersDelete.js');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

router.delete('/reservations/:reservation_id', checkAdminRole, reservationControllersDelete.deleteReservation);

module.exports = router;
