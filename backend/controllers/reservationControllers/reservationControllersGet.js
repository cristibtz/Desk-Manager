const Reservations = require("../../database/models").Reservations;
const { getUserInfoFromTokenHeader } = require('../../auth/auth.js');

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

exports.getUserReservationsByAdmin = [
    param('user_id').isString().withMessage('Item must be a string'),

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


exports.getUserReservationsByUser = async (req, res) => {

    const userInfo = await getUserInfoFromTokenHeader(req);
    const user_id = userInfo.keycloak_user_id;
    
    try {

        const reservations = await Reservations.findAll({
            attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
            where: {
                user_id: user_id
            }
        });
        
        if (reservations.length === 0){
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({message: "No reservations found"});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(reservations, null, 2));    
    } catch(error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({message:"Internal Server Error"}); 
    }

}

exports.getUserReservation = [
    param('reservation_id').isInt().withMessage('Reservation ID must be an integer'),

    async (req, res) => {
        const userInfo = await getUserInfoFromTokenHeader(req);
        const user_id = userInfo.keycloak_user_id;

        const reservation_id = req.params.reservation_id;

        //Check if request parameters are missing
        if(!reservation_id) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message:"Required request parameter missing!"});
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message: "Bad request"});
        }

        try {

            const reservation = await Reservations.findOne({
                attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
                where: {
                    id: reservation_id,
                    user_id: user_id
                }
            });

            if (!reservation){
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

exports.occupied = async (req, res) => {

    //Get reservation info
    try {
        const occupied_desks = await Reservations.findAll({
            attributes: ['room_id','desk_id', 'start_date', 'end_date'],
        });

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(occupied_desks, null, 2));

    } catch(error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({message:"Internal Server Error"}); 
    }

}