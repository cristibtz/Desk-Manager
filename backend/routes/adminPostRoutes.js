const express = require('express');
const router = express.Router();
const adminControllerPost = require('../controllers/adminControllerPost');

router.post("/reservations", adminControllerPost.postReservations)

module.exports = router;