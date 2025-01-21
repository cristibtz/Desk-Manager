const express = require('express');
const router = express.Router();
const userControllerPost = require('../../controllers/userControllers/userControllerPost');

router.post('/user/reservations', userControllerPost.createReservation);
router.post('/user/reservations/:reservation_id', userControllerPost.updateReservation);

module.exports = router;