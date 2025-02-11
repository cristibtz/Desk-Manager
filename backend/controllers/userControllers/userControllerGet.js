const db = require("../../database/database")
const Users = require("../../database/models").Users;
const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;
const Reservations = require("../../database/models").Reservations;

const {param, validationResult} = require('express-validator');

//To do: import exported_session here, parse the keycloak-token and extract email specific to every user
const user_email = "alex@app.com";

exports.getUserReservations = async (req, res) => {

    try {
        //Get user id by email
        const user_id = await Users.findOne({
            attributes: ['id'],
            where: {
                email: user_email
            }
        });

        const reservations = await Reservations.findAll({
            attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
            where: {
                user_id: user_id.id
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
            //Check if reservation corresponds to user
            const user_id = await Users.findOne({
                attributes: ['id'],
                where: {
                    email: user_email
                }
            });

            const reservation = await Reservations.findOne({
                attributes: [ 'id', 'user_id', 'room_id', 'desk_id', 'start_date', 'end_date', 'note'],
                where: {
                    id: reservation_id,
                    user_id: user_id.id
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