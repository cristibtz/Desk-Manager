const express = require('express');
const router = express.Router();
const reservationControllersGet = require('../../controllers/reservationControllers/reservationControllersGet.js');


const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');
const checkUserRole = keycloak.protect('realm:user');


//GET
//Reservations routes
router.get('/reservations', checkAdminRole, reservationControllersGet.getReservations);
router.get('/reservations/:reservation_id', checkAdminRole, reservationControllersGet.getReservation);

router.get('/user/reservations', checkUserRole, reservationControllersGet.getUserReservationsByUser);
router.get('/user/reservations/:reservation_id', checkUserRole, reservationControllersGet.getUserReservation);
router.get('/occupied', checkUserRole, reservationControllersGet.occupied);

module.exports = router;