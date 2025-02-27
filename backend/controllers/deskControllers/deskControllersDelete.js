const Desks = require("../../database/models").Desks;
const Reservations = require("../../database/models").Reservations;

const { param, validationResult } = require('express-validator');

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