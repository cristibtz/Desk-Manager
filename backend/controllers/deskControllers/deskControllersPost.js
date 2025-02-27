const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;

const { param, body, validationResult } = require('express-validator');

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