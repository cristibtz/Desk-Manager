const axios = require('axios');
const dotenv = require('dotenv').config({ path: '../.env' });
const { param, validationResult } = require('express-validator');

// Fetch all users
exports.fetchUsers = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    try {
        const response = await axios.get(
            `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
            {
                headers: {
                    Authorization: token,
                    Host: new URL(process.env.KEYCLOAK_URL).host,
                },
            }
        );

        if (!response.data || response.data.length === 0) {
            return res.status(404).json({ message: "Users not found" });
        }

        console.log("Fetched users:", response.data);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Failed to fetch users:", error.message);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ message: "Internal Server Error", details: error.message });
    }
};

// Fetch a single user by ID
exports.fetchUser = [
    param('user_id').isString().withMessage('Item must be a string'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ message: "Bad request" });
        }

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
        }

        try {
            const response = await axios.get(
                `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${req.params.user_id}`,
                {
                    headers: {
                        Authorization: token,
                        Host: new URL(process.env.KEYCLOAK_URL).host, 
                    },
                }
            );

            if (!response.data) {
                return res.status(404).json({ message: "User not found" });
            }

            console.log("Fetched user:", response.data);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error("Failed to fetch user:", error.message);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ message: "Internal Server Error", details: error.message });
        }
    },
];