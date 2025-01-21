const express = require('express');
const router = express.Router();
const adminControllerPost = require('../../controllers/adminControllers/adminControllerPost');

router.post("/reservations", adminControllerPost.createReservation)
router.post('/reservations/:reservation_id', adminControllerPost.updateReservation);
router.post('/rooms', adminControllerPost.createRoom);
router.post('/rooms/:room_number', adminControllerPost.updateRoom);
router.post('/desks', adminControllerPost.createDesk);
router.post('/desks/:desk_id', adminControllerPost.updateDesk);

module.exports = router;