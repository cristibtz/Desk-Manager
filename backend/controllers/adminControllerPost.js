const db = require("../database/database")
const Users = require("../database/models").Users;
const Rooms = require("../database/models").Rooms;
const Desks = require("../database/models").Desks;
const Reservations = require("../database/models").Reservations;
const { Op } = require('sequelize');

const { param, body, validationResult } = require('express-validator');

exports.postReservation = [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('room_id').isInt().withMessage('Room ID must be an integer'),
    body('desk_id').isInt().withMessage('Desk ID must be an integer'),
    body('start_date').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    body('note').isString().withMessage('Note must be a string')
    .escape().withMessage('Note contains invalid characters'),
    body('duration').isInt().withMessage('Duration must be an integer')
    .custom(value => [30, 60, 90, 120].includes(parseInt(value)))
    .withMessage('Duration must be one of the following values: 30, 60, 90, 120'),

    async (req, res) => {
        const { user_id, room_id, desk_id, start_date, note, duration } = req.body;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await Users.findByPk(user_id, {
            attributes: [ 'id', 'username', 'email'],
        });
        const room = await Rooms.findByPk(room_id, {
            attributes: [ 'id', 'room_number', 'room_alias'],
        });
        const desk = await Desks.findByPk(desk_id, {
            attributes: [ 'id', 'desk_number', 'room_id'],
        });

        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        if (!room) {
            return res.status(400).json({ message: "Room not found." });
        }

        if (!desk) {
            return res.status(400).json({ message: "Desk not found." });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

        //Check if reservation is in proper time range
        const startHour = startDate.getUTCHours();
        const endHour = endDate.getUTCHours();
        if (startHour < 8 || endHour > 18 || (endHour === 18 && endDate.getUTCMinutes() > 0)) {
            return res.status(400).json({ message: "Reservations must be between 8:00 AM and 6:00 PM." });
        }

        //Check how many reservations a user has in 24h time range
        const startOfDay = new Date(startDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const userReservations = await Reservations.findAll({
            attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],

            where: {
                user_id: user_id,
                start_date: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        if (userReservations.length >= 3) {
            return res.status(400).json({ message: "A user can have a maximum of 3 reservations per day." });
        }

        //Check for overlapping reservations
        const overlappingReservations = await Reservations.findAll({
            attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],

            where: {
                desk_id: desk_id,
                [Op.or]: [
                    {
                        start_date: {
                            [Op.lt]: endDate,
                            [Op.gt]: startDate
                        }
                    },
                    {
                        end_date: {
                            [Op.lt]: endDate,
                            [Op.gt]: startDate
                        }
                    },
                    {
                        start_date: {
                            [Op.lt]: startDate
                        },
                        end_date: {
                            [Op.gt]: endDate
                        }
                    }
                ]
            }
        });

        if (overlappingReservations.length > 0) {
            return res.status(400).json({ Message: "Reservations cannot overlap." });
        }

        await Reservations.create({
            user_id: user_id,
            room_id: room_id,
            desk_id: desk_id,
            start_date: startDate,
            end_date: endDate,
            note: note
        },{
            returning: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note', 'createdAt', 'updatedAt']
        });

        res.status(201).json({ message: "Reservation created successfully." });
    }

]

exports.updateReservation = [
    param('reservation_id').isInt().withMessage('Reservation ID must be an integer'),
    body('new_start_date').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    body('duration').isInt().withMessage('Duration must be an integer')
    .custom(value => [30, 60, 90, 120].includes(parseInt(value)))
    .withMessage('Duration must be one of the following values: 30, 60, 90, 120'),

    async (req, res) => {
        const reservation_id = req.params.reservation_id;
        const { new_start_date, duration} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Bad request" });
        }

        //Check if reservation exists
        const reservation = await Reservations.findByPk(reservation_id, {
            attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
        });
        if (!reservation) {
            return res.status(400).json({ message: "Reservation not found." });
        }

        const startDate = new Date(new_start_date);
        const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

        //Check if reservation is in proper time range
        const startHour = startDate.getUTCHours();
        const endHour = endDate.getUTCHours();
        if (startHour < 8 || endHour > 18 || (endHour === 18 && endDate.getUTCMinutes() > 0)) {
            return res.status(400).json({ message: "Reservations must be between 8:00 AM and 6:00 PM." });
        }

        //Check for overlapping reservations
        const overlappingReservations = await Reservations.findAll({
            attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],

            where: {
                desk_id: reservation.desk_id,
                [Op.or]: [
                    {
                        start_date: {
                            [Op.lt]: endDate,
                            [Op.gt]: startDate
                        }
                    },
                    {
                        end_date: {
                            [Op.lt]: endDate,
                            [Op.gt]: startDate
                        }
                    },
                    {
                        start_date: {
                            [Op.lt]: startDate
                        },
                        end_date: {
                            [Op.gt]: endDate
                        }
                    }
                ]
            }
        });

        if(overlappingReservations > 0) {
            return res.status(400).json({ message: "Reservations cannot overlap." });
        }

        await Reservations.update({
            start_date: startDate,
            end_date: endDate,
        },{
            where: {
                id: reservation_id
            }
        });

        res.status(201).json({ message: "Reservation updated successfully." });

    }
]