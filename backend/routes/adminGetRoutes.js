const express = require('express');
const router = express.Router();
const adminControllerGet = require('../controllers/adminControllerGet');

//GET
//Reservations routes
router.get('/reservations', adminControllerGet.getReservations);
router.get('/reservations/:reservation_id', adminControllerGet.getReservation);

//Users routes
router.get('/users', adminControllerGet.getUsers);
router.get('/users/:user_id', adminControllerGet.getUser);
router.get('/users/:user_id/reservations', adminControllerGet.getUserReservations);


//Rooms routes
router.get('/rooms/', adminControllerGet.getRooms);
router.get('/rooms/:room_number', adminControllerGet.getRoom);
router.get('/rooms/:room_id/desks', adminControllerGet.getRoomDesks);


//Desks routes
router.get('/desks/', adminControllerGet.getDesks);
router.get('/desks/:desk_id', adminControllerGet.getDesk);

module.exports = router;