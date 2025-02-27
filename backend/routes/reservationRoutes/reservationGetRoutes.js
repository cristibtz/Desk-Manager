const express = require('express');
const router = express.Router();
const reservationControllersGet = require('../../controllers/reservationControllers/reservationControllersGet.js');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

//GET
//Reservations routes
router.get('/reservations', checkAdminRole, reservationControllersGet.getReservations);
router.get('/reservations/:reservation_id', checkAdminRole, reservationControllersGet.getReservation);

module.exports = router;