const Rooms = require("../../database/models").Rooms;

const { param, body, validationResult } = require('express-validator');

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