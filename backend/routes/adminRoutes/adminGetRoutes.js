const express = require('express');
const router = express.Router();
const adminControllerGet = require('../../controllers/adminControllers/adminControllerGet');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

//GET
//Reservations routes
router.get('/reservations', checkAdminRole, adminControllerGet.getReservations);
router.get('/reservations/:reservation_id', checkAdminRole, adminControllerGet.getReservation);

//Users routes
router.get('/users', checkAdminRole, adminControllerGet.getUsers);
router.get('/users/:user_id', checkAdminRole, adminControllerGet.getUser);
router.get('/users/:user_id/reservations', checkAdminRole, adminControllerGet.getUserReservations);


//Rooms routes
router.get('/rooms/', checkAdminRole, adminControllerGet.getRooms);
router.get('/rooms/:room_number', checkAdminRole, adminControllerGet.getRoom);
router.get('/rooms/:room_id/desks', checkAdminRole, adminControllerGet.getRoomDesks);


//Desks routes
router.get('/desks/', checkAdminRole, adminControllerGet.getDesks);
router.get('/desks/:desk_id', checkAdminRole, adminControllerGet.getDesk);

module.exports = router;