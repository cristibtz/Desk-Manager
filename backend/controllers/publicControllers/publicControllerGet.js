const Rooms = require("../../database/models").Rooms;
const Desks = require("../../database/models").Desks;

const { param, validationResult } = require('express-validator');


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