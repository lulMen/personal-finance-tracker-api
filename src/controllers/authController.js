const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register a new user via OAuth
// @route POST /auth/signup
const signup = asyncHandler(async (req, res) => {
    const { oauthProvider, oauthToken } = req.body;

    if (!oauthProvider || !oauthToken) {
        res.status(400);
        throw new Error('OAuth provider and token are required');
    }

    let userData;

    // Verify OAuth token with provider
    if (oauthProvider === 'google') {
        try {
            // Verify the ID token
            const ticket = await client.verifyIdToken({
                idToken: oauthToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            userData = {
                name: payload.name,
                email: payload.email,
                googleId: payload.sub,
            };
        } catch (err) {
            res.status(401);
            throw new Error('Invalid Google OAuth token: ', + err.message);
        }
    } else {
        res.status(400);
        throw new Error('Unsupported OAuth provider');
    }

    // Check if user exists
    let user = await User.findOne({ email: userData.email });

    if (!user) {
        user = await User.create({
            name: userData.name,
            email: userData.email,
            oauthProvider,
            googleId: userData.googleId,
            role: 'user',
        });
    }

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user),
    });
});

// @desc Get user profile
// @route GET /auth/profile
const getProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json(req.user);
});

// @desc Update user profile
// @route PUT /auth/profile
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser),
    });
});

// @desc Delete user account
// @route DELETE /auth/profile
const deleteProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    await user.deleteOne();
    res.status(200).json({ message: 'User account deleted successfully' });
});

module.exports = { signup, getProfile, updateProfile, deleteProfile };