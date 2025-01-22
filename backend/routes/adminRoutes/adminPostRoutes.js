const express = require('express');
const router = express.Router();
const adminControllerPost = require('../../controllers/adminControllers/adminControllerPost');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

router.post("/reservations", checkAdminRole, adminControllerPost.createReservation)
router.post('/reservations/:reservation_id', checkAdminRole, adminControllerPost.updateReservation);
router.post('/rooms', checkAdminRole, adminControllerPost.createRoom);
router.post('/rooms/:room_number', checkAdminRole, adminControllerPost.updateRoom);
router.post('/desks', checkAdminRole, adminControllerPost.createDesk);
router.post('/desks/:desk_id', checkAdminRole, adminControllerPost.updateDesk);

module.exports = router;