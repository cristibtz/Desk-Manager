const Users = require("../../database/models").Users;
const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;
const Reservations = require("../../database/models").Reservations;
const { Op } = require('sequelize');

const { param, body, validationResult } = require('express-validator');

exports.createReservation = [
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
        
        //Check if any request parameters are missing
        if (!user_id || !room_id || !desk_id || !start_date || !note || !duration) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Required request parameters missing!" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
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
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "User not found." });
        }

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
                res.setHeader('Content-Type', 'application/json');
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

        //Check if reservation exists
        const reservation = await Reservations.findByPk(reservation_id, {
            attributes: ['id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
        });
        if (!reservation) {
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
                    desk_id: reservation.desk_id,  
                    id: {
                        [Op.ne]: reservation_id   
                    },
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
                res.setHeader('Content-Type', 'application/json');  
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

exports.createRoom = [
    body('room_number').isInt().withMessage('Room number must be an integer'),
    body('room_alias').isString().withMessage('Room alias must be a string')
    .escape().withMessage('Note contains invalid characters'),

    async (req, res) => {
        const { room_number, room_alias } = req.body;
        
        //Check if any request parameters are missing
        if (!room_number || !room_alias) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Required request parameters missing!" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }
        
        try {
            //Check if room number is already taken
            const room = await Rooms.findOne({
                where: {
                    room_number: room_number
                }
            });

            if(room) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ message: "Room number already taken." });
            }

            await Rooms.create({
                room_number: room_number,
                room_alias: room_alias
            }, {
                returning: ['id', 'room_number', 'room_alias', 'createdAt', 'updatedAt']
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: "Room created successfully." });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
]

exports.updateRoom = [
    param('room_number').isInt().withMessage('Room number must be an integer'),
    body('room_alias').isString().withMessage('Room alias must be a string')
    .escape().withMessage('Room alias contains invalid characters'),

    async (req, res) => {
        const room_number = req.params.room_number;
        const { room_alias } = req.body;

        //Check if any request parameters are missing
        if (!room_alias) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Required request parameters missing!" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        try {
            //Check if room exists
            const room = await Rooms.findOne({
                where: {
                    room_number: room_number
                }
            });

            if(!room) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ message: "Room not found." });
            }

            await Rooms.update({
                room_alias: room_alias
            }, {
                where: {
                    room_number: room_number
                }
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: "Room updated successfully." });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
]
exports.createDesk = [
    body('room_number').isInt().withMessage('Room number must be an integer'),
    body('desk_number').isInt().withMessage('Desk number must be an integer'),

    async (req, res) => {
        const { room_number, desk_number } = req.body;
        
        //Check if any request parameters are missing
        if (!room_number || !desk_number) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Required request parameters missing!" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }
        
        try {
            //Check if room exists
            const room = await Rooms.findOne({
                where: {
                    room_number: room_number
                }
            });

            if(!room) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ message: "Can't create desk in an nonexistent room." });
            }

            //Check if desk number is already taken in that room
            const desk = await Desks.findOne({
                where: {
                    room_id: room.id,
                    desk_number: desk_number
                },
                attributes: ['id', 'room_id', 'desk_number']
            });

            if(desk) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ message: "Desk number already taken." });
            }

            await Desks.create({
                room_id: room.id,
                desk_number: desk_number
            }, {
                returning: ['id', 'room_id', 'desk_number', 'createdAt', 'updatedAt']
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: "Desk created successfully." });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
]

exports.updateDesk = [
    param('desk_id').isInt().withMessage('Desk ID must be an integer'),
    body('desk_number').isInt().withMessage('Desk number must be an integer'),

    async (req, res) => {
        const desk_id = req.params.desk_id;
        const { desk_number } = req.body;

        //Check if any request parameters are missing
        if (!desk_number || !desk_id) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Required request parameters are missing!" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        try {
            //Check if desk exists
            const desk = await Desks.findByPk(desk_id, {
                attributes: ['id', 'room_id', 'desk_number']
            });

            if(!desk) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ message: "Desk not found." });
            }

            //Check if desk number is already taken in that room
            const deskNo = await Desks.findOne({
                where: {
                    room_id: desk.room_id,
                    desk_number: desk_number
                },
                attributes: ['id', 'room_id', 'desk_number']
            });

            if(deskNo) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ message: "Desk number already taken." });
            }

            await Desks.update({
                desk_number: desk_number
            }, {
                where: {
                    id: desk_id
                }
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: "Desk updated successfully." });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
]