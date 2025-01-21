const express = require('express');
const router = express.Router();
const userControllerDelete = require('../../controllers/userControllers/userControllerDelete');

router.delete('/user/reservations/:reservation_id', userControllerDelete.deleteReservation);

module.exports = router;
