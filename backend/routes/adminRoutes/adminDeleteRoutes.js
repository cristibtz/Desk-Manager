const express = require('express');
const router = express.Router();
const adminControllerDelete = require('../../controllers/adminControllers/adminControllerDelete');

router.delete('/users/:user_id', adminControllerDelete.deleteUser);
router.delete('/reservations/:reservation_id', adminControllerDelete.deleteReservation);
router.delete('/rooms/:room_number', adminControllerDelete.deleteRoom);
router.delete('/desks/:desk_id', adminControllerDelete.deleteDesk);

module.exports = router;
