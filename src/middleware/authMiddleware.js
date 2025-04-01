const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from DB
            req.user = await User.findById(decoded.id).select('-password');

            // debugging
            console.log(decoded);
            console.log(token);
            console.log(req.user);

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, invalid token');
        }
    }

    if (!token) {
        res.status(400);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };