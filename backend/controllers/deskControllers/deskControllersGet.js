const Desks = require("../../database/models").Desks;

const { param, validationResult } = require('express-validator');

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