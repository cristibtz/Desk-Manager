const db = require("../../database/database")
const Users = require("../../database/models").Users;
const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;
const Reservations = require("../../database/models").Reservations;

const { param, validationResult } = require('express-validator');

exports.deleteUser = [
    param('user_id').isInt().withMessage('User ID must be an integer'),

    async (req, res) => {
        const user_id = req.params.user_id;

        //Check if request parameters are missing
        if (!user_id) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ errors: 'Required request parameters missing!' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        try {
            //Check if user exists
            const user = await Users.findOne({
                where: { 
                    id: user_id 
                },
                attributes: ['id', 'username', 'email'] 
            });

            if(!user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ errors: 'User not found!' });
            }

            //Delete reservations associated with user first
            await Reservations.destroy({
                where: { user_id: user_id }
            });

            await Users.destroy({
                where: { id: user_id }
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: 'User deleted successfully!' });
        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
]

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

exports.deleteDesk = [
    param('desk_id').isInt().withMessage('Desk ID must be an integer'),

    async (req, res) => {
        const desk_id = req.params.desk_id;

        //Check if request parameters are missing
        if (!desk_id) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ errors: 'Required request parameters missing!' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        //Check if desk exists
        const desk = await Desks.findOne({
            where: { 
                id: desk_id 
            },
            attributes: ['id', 'desk_number', 'room_id'] 
        });

        if(!desk) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ errors: 'Desk not found!' });
        }

        try {
            //Delete reservations associated with desk first
            await Reservations.destroy({
                where: { desk_id: desk_id }
            });

            await Desks.destroy({
                where: { id: desk_id }
            });

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: 'Desk and reservations associated with it deleted successfully!' });
        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
]