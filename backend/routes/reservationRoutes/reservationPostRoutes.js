const express = require('express');
const router = express.Router();
const reservationControllersPost = require('../../controllers/reservationControllers/reservationControllersPost');

const { keycloak, exported_session } = require('../../auth/auth.js');

router.use(exported_session);

router.use(keycloak.middleware());

const checkAdminRole = keycloak.protect('realm:admin');
const checkUserRole = keycloak.protect('realm:user');


router.post("/reservations", checkAdminRole, reservationControllersPost.createReservationByAdmin)
router.post('/reservations/:reservation_id', checkAdminRole, reservationControllersPost.updateReservationByAdmin);

router.post('/user/reservations', checkUserRole, reservationControllersPost.createReservationByUser);
router.post('/user/reservations/:reservation_id', checkUserRole, reservationControllersPost.updateReservationByUser);

module.exports = router;