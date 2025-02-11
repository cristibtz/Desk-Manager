const db = require("../../database/database")
const Users = require("../../database/models").Users;
const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;
const Reservations = require("../../database/models").Reservations;

const { param, body, validationResult } = require('express-validator');

//To do: import exported_session here, parse the keycloak-token and extract email specific to every user
const email = "alex@app.com"

exports.deleteReservation = [
    param('reservation_id').isInt().withMessage('Reservation ID must be an integer'),

    async (req, res) => {
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
            //Check if reservation corresponds to user
            const user = await Users.findOne({
                attributes: ['id', 'username', 'email'],
                where: {
                    email: email,
                }
            });

            user_id = user.id;

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