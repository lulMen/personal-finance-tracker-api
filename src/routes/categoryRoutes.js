const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getCategories,
    createCategory,
} = require('../controllers/categoryController');

const router = express.Router();

// Protected routes
router.get('/', protect, getCategories);
router.post('/', protect, createCategory);

module.exports = router;