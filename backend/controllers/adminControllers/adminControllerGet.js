const Users = require("../../database/models").Users;
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

