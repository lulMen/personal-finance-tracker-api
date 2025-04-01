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

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);
router.get('/logout', protect, logout);

module.exports = router;