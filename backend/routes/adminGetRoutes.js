const express = require('express');
const router = express.Router();
const adminControllerGet = require('../controllers/adminControllerGet');

//GET
//Reservations routes
router.get('/reservations', adminControllerGet.getReservations);
router.get('/reservations/:item', adminControllerGet.getReservation);

//Users routes
router.get('/users', adminControllerGet.getUsers);
router.get('/users/:item', adminControllerGet.getUser);
router.get('/users/:item/reservations', adminControllerGet.getUserReservations);


//Rooms routes
router.get('/rooms/', adminControllerGet.getRooms);
router.get('/rooms/:item', adminControllerGet.getRoom);
router.get('/rooms/:item/desks', adminControllerGet.getRoomDesks);


//Desks routes
router.get('/desks/', adminControllerGet.getDesks);
router.get('/desks/:item', adminControllerGet.getDesk);

module.exports = router;