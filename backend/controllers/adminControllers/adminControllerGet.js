const db = require("../../database/database")
const Users = require("../../database/models").Users;
const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;
const Reservations = require("../../database/models").Reservations;

const { param, validationResult } = require('express-validator');

//Reservations
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservations.findAll({
            attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
        });
        
        if (reservations.length === 0){
            return res.status(404).json({message:"No reservations found"});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(reservations, null, 2));    
    } catch(error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({message:"Internal Server Error"}); 
    }

}

exports.getReservation = [    
    param('reservation_id').isInt().withMessage('Item must be an integer'),

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message:"Bad request"});
        }

        try {
            const reservationId = req.params.reservation_id;

            const reservation = await Reservations.findByPk(reservationId, {
                attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
            })

            if(!reservation){
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({message:"Reservation not found"});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(reservation, null, 2)); 

        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({message:"Internal Server Error"}); 
        }
    }
]

//Users
exports.getUsers = async (req, res) => {

    try {
        const users = await Users.findAll({
            attributes: [ 'id', 'username', 'email'],
        });
        
        if (users.length === 0){
            return res.status(404).json({message:"No users found"});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(users, null, 2));    

    } catch(error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({message:"Internal Server Error"}); 
    }

}

exports.getUser = [    
    param('user_id').isInt().withMessage('Item must be an integer'),

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message:"Bad request"});
        }

        try {
            const userId = req.params.user_id;

            const user = await Users.findByPk(userId, {
                attributes: [ 'id', 'username', 'email'],
            })

            if(!user){
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({message:"User not found"});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(user, null, 2)); 

        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({message:"Internal Server Error"}); 
        }
    }
]

exports.getUserReservations = [
    param('user_id').isInt().withMessage('Item must be an integer'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message:"Bad request"});
        }

        try {
            const userId = req.params.user_id;

            const userReservations = await Reservations.findAll({
                where: {
                    user_id: userId,
                },
                attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],

            })

            if(userReservations.length === 0){
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({message:"User's reservations not found"});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(userReservations, null, 2)); 

        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({message:"Internal Server Error"}); 
        }
    }
]

//Rooms
exports.getRooms = async (req, res) => {

    try {
        const rooms = await Rooms.findAll({
            attributes: [ 'id', 'room_number', 'room_alias'],
        });
        
        if (rooms.length === 0){
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({message:"No rooms found"});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(rooms, null, 2));    

    } catch(error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({message:"Internal Server Error"}); 
    }
}

exports.getRoom = [
    param('room_number').isInt().withMessage('Item must be an integer'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message:"Bad request"});
        }

        try {
            const roomNumber = req.params.room_number;

            const room = await Rooms.findOne({
                where: { 
                    room_number: roomNumber,
                }, 
                attributes: [ 'id', 'room_number', 'room_alias'],
            } )

            if(!room){
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({message:"Room not found"});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(room, null, 2)); 

        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({message:"Internal Server Error"}); 
        }
    }
]

exports.getRoomDesks = [
    param('room_id').isInt().withMessage('Item must be an integer'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message:"Bad request"});
        }

        try {
            const roomId = req.params.room_id;

            const roomDesks = await Desks.findAll({
                where: {
                    room_id: roomId,
                },
                attributes: [ 'id', 'desk_number', 'room_id'],

            })

            if(roomDesks.length === 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({message:"No room's desks found"});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(roomDesks, null, 2)); 

        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({message:"Internal Server Error"});
        }
    }
]

//Desks
exports.getDesks = async (req, res) => {
    try {
        const desks = await Desks.findAll({
            attributes: [ 'id', 'desk_number', 'room_id'],
        });
        
        if (desks.length === 0){
            return res.status(404).json({message:"No desks found"});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(desks, null, 2));    

    } catch(error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({message:"Internal Server Error"}); 
    }
}

exports.getDesk = [
    param('desk_id').isInt().withMessage('Item must be an integer'),


    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message:"Bad request"});
        }

        try {
            const deskId = req.params.desk_id;

            const desk = await Desks.findByPk(deskId, {
                attributes: [ 'id', 'desk_number', 'room_id'],
            })

            if(!desk){
                return res.status(404).json({message:"Desk not found"});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(desk, null, 2)); 

        } catch(error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({message:"Internal Server Error"}); 
        }
    }
]