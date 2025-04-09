const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Protected routes
router.get('/', protect, getCategories);
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;