const express = require('express');
const router = express.Router();
const userControllersGet = require('../../controllers/userControllers/userControllersGet.js');
const reservationControllersGet = require('../../controllers/reservationControllers/reservationControllersGet.js');
const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

//User routes
router.get('/users/', checkAdminRole, userControllersGet.fetchUsers);
router.get('/users/:user_id/reservations', checkAdminRole, reservationControllersGet.getUserReservationsByAdmin);
router.get('/users/:user_id', checkAdminRole, userControllersGet.fetchUser);
module.exports = router;