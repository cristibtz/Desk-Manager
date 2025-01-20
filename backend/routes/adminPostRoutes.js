const express = require('express');
const router = express.Router();
const adminControllerPost = require('../controllers/adminControllerPost');

router.post("/reservations", adminControllerPost.postReservation)
router.post('/reservations/:reservation_id', adminControllerPost.updateReservation);

module.exports = router;