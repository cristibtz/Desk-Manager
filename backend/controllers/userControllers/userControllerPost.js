const db = require("../../database/database")
const Users = require("../../database/models").Users;
const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;
const Reservations = require("../../database/models").Reservations;
const {getUserInfoFromToken} = require("../../auth/auth");
const { Op } = require('sequelize');

const { param, body, validationResult } = require('express-validator');

exports.createReservation = [
    body('room_id').isInt().withMessage('Room ID must be an integer'),
    body('desk_id').isInt().withMessage('Desk ID must be an integer'),
    body('start_date').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    body('note').isString().withMessage('Note must be a string')
    .escape().withMessage('Note contains invalid characters'),
    body('duration').isInt().withMessage('Duration must be an integer')
    .custom(value => [30, 60, 90, 120].includes(parseInt(value)))
    .withMessage('Duration must be one of the following values: 30, 60, 90, 120'),

    async (req, res) => {

        const userInfo = await getUserInfoFromToken(req);
        const user_email = userInfo.email;

        const { room_id, desk_id, start_date, note, duration } = req.body;

        //Check if any request parameters are missing
        if (!room_id || !desk_id || !start_date || !note || !duration) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Required request parameters missing!" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        const user = await Users.findOne({
            attributes: ['id'],
            where: {
                email: user_email
            }
        });

        const user_id = user.id;

        const room = await Rooms.findByPk(room_id, {
            attributes: [ 'id', 'room_number', 'room_alias'],
        });
        const desk = await Desks.findByPk(desk_id, {
            attributes: [ 'id', 'desk_number', 'room_id'],
        });

        if (!room) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Room not found." });
        }

        if (!desk) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Desk not found." });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

        //Check if reservation is in proper time range
        const startHour = startDate.getUTCHours();
        const endHour = endDate.getUTCHours();
        if (startHour < 8 || endHour > 18 || (endHour === 18 && endDate.getUTCMinutes() > 0)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Reservations must be between 8:00 AM and 6:00 PM." });
        }

        try {
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
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ message: "A user can have a maximum of 3 reservations per day." });
            }

            //Check for overlapping reservations
            const overlappingReservations = await Reservations.findAll({
                attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],

                where: {
                    desk_id: desk_id,
                    [Op.and]: [
                        {
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
                            [Op.and]: [
                                {
                                    start_date: {
                                    [Op.lte]: startDate
                                    }
                                },
                                {
                                    end_date: {
                                    [Op.gte]: endDate
                                    }
                                }
                                ]
                            }
                            ]
                        },
                        {
                            [Op.not]: {
                            [Op.or]: [
                                {
                                end_date: startDate  
                                },
                                {
                                start_date: endDate  
                                }
                            ]
                            }
                        }
                    ]
                }
            });

            if (overlappingReservations.length > 0) {
                return res.status(400).json({ message: "Reservations cannot overlap." });
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

            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ message: "Reservation created successfully." });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

]

exports.updateReservation = [
    param('reservation_id').isInt().withMessage('Reservation ID must be an integer'),
    body('new_start_date').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    body('duration').isInt().withMessage('Duration must be an integer')
    .custom(value => [30, 60, 90, 120].includes(parseInt(value)))
    .withMessage('Duration must be one of the following values: 30, 60, 90, 120'),

    async (req, res) => {

        const userInfo = await getUserInfoFromToken(req);
        const user_email = userInfo.email;

        const reservation_id = req.params.reservation_id;
        const { new_start_date, duration } = req.body;

        //Check if any request parameters are missing
        if (!reservation_id || !new_start_date || !duration) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Required request parameters missing!" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        //Check if reservation exists and belongs to user
        const user = await Users.findOne({
            attributes: ['id'],
            where: {
                email: user_email
            }
        });
        const user_id = user.id;

        const reservation = await Reservations.findOne({
            attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
            where: {
                id: reservation_id,
                user_id: user_id
            }
        });

        if (!reservation) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ message: "Reservation not found." });
        }

        const startDate = new Date(new_start_date);
        const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

        //Check if reservation is in proper time range
        const startHour = startDate.getUTCHours();
        const endHour = endDate.getUTCHours();
        if (startHour < 8 || endHour > 18 || (endHour === 18 && endDate.getUTCMinutes() > 0)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Reservations must be between 8:00 AM and 6:00 PM." });
        }

        try {
            //Check for overlapping reservations
            const overlappingReservations = await Reservations.findAll({
                attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
                where: {
                    [Op.and]: [
                        {
                            desk_id: reservation.desk_id,  
                            id: {
                                [Op.ne]: reservation_id    
                            }
                        },
                        {
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
                                    [Op.and]: [
                                        {
                                            start_date: {
                                                [Op.lte]: startDate
                                            }
                                        },
                                        {
                                            end_date: {
                                                [Op.gte]: endDate
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            [Op.not]: {
                                [Op.or]: [
                                    {
                                        end_date: startDate
                                    },
                                    {
                                        start_date: endDate
                                    }
                                ]
                            }
                        }
                    ]
                }
            });

            if (overlappingReservations.length > 0) { 
                return res.status(400).json({ message: "Reservations cannot overlap." });
            }

            await Reservations.update({
                start_date: startDate,
                end_date: endDate,
            }, {
                where: {
                    id: reservation_id
                }
            });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ message: "Reservation updated successfully." });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
];