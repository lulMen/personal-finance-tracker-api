const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const {
    signup,
    getProfile,
    updateProfile,
    deleteProfile,
    login,
    logout
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

module.exports = router;