const express = require('express');
const router = express.Router();
const userControllerDelete = require('../../controllers/userControllers/userControllerDelete');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());
const checkUserRole = keycloak.protect('realm:user');

router.delete('/user/reservations/:reservation_id', checkUserRole, userControllerDelete.deleteReservation);

module.exports = router;
