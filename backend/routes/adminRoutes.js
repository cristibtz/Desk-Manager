const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

//GET
//Reservations routes
router.get('/reservations', adminController.getReservations);
router.get('/reservations/:item', adminController.getReservation);

//Users routes
router.get('/users', adminController.getUsers);
router.get('/users/:item', adminController.getUser);
//router.get('/users/:item/reservations', adminController.user_reservations_get);

/*
//Rooms routes
router.get('/rooms/', adminController.rooms);
router.get('/rooms/:item', adminController.rooms_item_get);
router.get('/rooms/:item/desks', adminController.room_desks_get);


//Desks routes
router.get('/desks/', adminController.desks);
router.get('/desks/:item', adminController.desks_item_get);
*/
module.exports = router;