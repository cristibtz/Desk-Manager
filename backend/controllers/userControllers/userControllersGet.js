const KeycloakAdminClient = require('@keycloak/keycloak-admin-client').default;
const dotenv = require('dotenv').config({path: '../.env'});
const { param, validationResult } = require('express-validator');

exports.fetchUsers = async (req, res) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    const kcAdminClient = new KeycloakAdminClient({
        baseUrl: process.env.KEYCLOAK_URL,
        realmName: process.env.KEYCLOAK_REALM,
    });
    
    kcAdminClient.setAccessToken(token.replace('Bearer ', ''));


    try {

        // Fetch all users
        const users = await kcAdminClient.users.find();

        if (!users) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ message: "Users not found" });
        }

        console.log(users)

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(users, null, 2))

    } catch (error) {
        console.error('User fetch failed:', error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({message:"Internal Server Error"}); 
    }
}

exports.fetchUser = [
    param('user_id').isString().withMessage('Item must be a string'),

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({message:"Bad request"});
        }

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
        }

        const kcAdminClient = new KeycloakAdminClient({
            baseUrl: process.env.KEYCLOAK_URL,
            realmName: process.env.KEYCLOAK_CLIENT,
        });
        
        kcAdminClient.setAccessToken(token.replace('Bearer ', ''));


        try {

            // Fetch all users
            const user = await kcAdminClient.users.findOne({ id: req.params.user_id });

            if (!user) {
                console.log(req.params.user_id);
                console.log(user);
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ message: "User not found" });
            }

            console.log(user)

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(user, null, 2))

        } catch (error) {
            console.error('User fetch failed:', error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({message:"Internal Server Error"}); 
        }
    }
]