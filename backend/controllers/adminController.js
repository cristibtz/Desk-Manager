const db = require("../database/database")
const Users = require("../database/models").Users;
const Rooms = require("../database/models").Rooms;
const Desks = require("../database/models").Desks;
const Reservations = require("../database/models/").Reservations;

const { param, validationResult } = require('express-validator');


//GET

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
        res.status(500).json({message:"Internal Server Error"}); 
    }

}

exports.getReservation = [    
    param('item').isInt().withMessage('Item must be an integer'),

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message:"Bad request"});
        }

        try {
            const reservationId = req.params.item;

            const reservation = await Reservations.findByPk(reservationId, {
                attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
            })

            if(!reservation){
                return res.status(404).json({message:"Reservation not found"});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(reservation, null, 2)); 

        } catch(error) {
            console.log(error);
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
        res.status(500).json({message:"Internal Server Error"}); 
    }

}

exports.getUser = [    
    param('item').isInt().withMessage('Item must be an integer'),

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message:"Bad request"});
        }

        try {
            const userId = req.params.item;

            const user = await Users.findByPk(userId, {
                attributes: [ 'id', 'username', 'email'],
            })

            if(!user){
                return res.status(404).json({message:"User not found"});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(user, null, 2)); 

        } catch(error) {
            console.log(error);
            res.status(500).json({message:"Internal Server Error"}); 
        }
    }
]