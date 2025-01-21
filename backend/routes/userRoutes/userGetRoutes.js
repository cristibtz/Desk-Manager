const express = require('express');
const router = express.Router();
const userControllerGet = require('../../controllers/userControllers/userControllerGet');


router.get('/user/reservations', userControllerGet.getUserReservations);
router.get('/user/reservations/:reservation_id', userControllerGet.getUserReservation);
router.get('/occupied', userControllerGet.occupied);

module.exports = router;