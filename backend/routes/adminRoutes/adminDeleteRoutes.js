const express = require('express');
const router = express.Router();
const adminControllerDelete = require('../../controllers/adminControllers/adminControllerDelete');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkAdminRole = keycloak.protect('realm:admin');

router.delete('/users/:user_id', checkAdminRole, adminControllerDelete.deleteUser);
router.delete('/reservations/:reservation_id', checkAdminRole, adminControllerDelete.deleteReservation);
router.delete('/rooms/:room_number', checkAdminRole, adminControllerDelete.deleteRoom);
router.delete('/desks/:desk_id', checkAdminRole, adminControllerDelete.deleteDesk);

module.exports = router;
