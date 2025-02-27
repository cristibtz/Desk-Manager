const Reservations = require("../../database/models").Reservations;

const { param, validationResult } = require('express-validator');

exports.deleteReservation = [
    param('reservation_id').isInt().withMessage('Reservation ID must be an integer'),

    async (req, res) => {
        const reservation_id = req.params.reservation_id;

        //Check if request parameters are missing
        if (!reservation_id) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ errors: 'Required request parameters missing!' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            //Check if reservation exists
            const reservation = await Reservations.findOne({
                where: { 
                    id: reservation_id 
                },
                attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date'] 
            });

            if(!reservation) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ errors: 'Reservation not found!' });
            }

            await Reservations.destroy({
                where: { id: reservation_id }
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: 'Reservation deleted successfully!' });
        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
]


exports.userDeleteReservation = [
    param('reservation_id').isInt().withMessage('Reservation ID must be an integer'),

    async (req, res) => {

        const userInfo = await getUserInfoFromTokenHeader(req);
        const user_id = userInfo.keycloak_user_id;

        const reservation_id = req.params.reservation_id;

        //Check if request parameters are missing
        if (!reservation_id) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Required request parameter missing!" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        try {
            
            const reservation = await Reservations.findOne({
                attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
                where: {
                    id: reservation_id,
                    user_id: user_id,
                }
            });

            if (!reservation) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ message: "Reservation not found" });
            }

            await Reservations.destroy({
                attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
                where: {
                    id: reservation_id,
                }
            });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: "Reservation deleted successfully" });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ message: "Internal Server Error" });
        }

    }
]