const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;
const Reservations = require("../../database/models").Reservations;

const { param, validationResult } = require('express-validator');

exports.deleteRoom = [
    param('room_number').isInt().withMessage('Room number must be an integer'),
    
    async (req, res) => {
        const room_number = req.params.room_number;

        //Check if request parameters are missing
        if (!room_number) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ errors: 'Required request parameters missing!' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        //Check if room exists
        const room = await Rooms.findOne({
            where: { 
                room_number: room_number 
            },
            attributes: ['id', 'room_number', 'room_alias'] 
        });

        if(!room) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ errors: 'Room not found!' });
        }


        try {
            // Find all desks associated with the room
            const desks = await Desks.findAll({
                where: { 
                    room_id: room.id 
                },
                attributes: ['id', 'desk_number', 'room_id']
            });

            for (const desk of desks) {
                await Reservations.destroy({
                    where: { desk_id: desk.id}
                });
            }

            await Desks.destroy({
                where: { room_id: room.id }
            });

            await Rooms.destroy({
                where: { room_number: room_number }
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: 'Room, subsequent desks and reservations associated with it deleted successfully!' });
        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
]