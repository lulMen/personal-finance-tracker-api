const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
} = require('../controllers/budgetController');

const router = express.Router();

// Protected routes
router.get('/', protect, getBudgets);
router.post('/', protect, createBudget);
router.put('/:id', protect, updateBudget);
router.delete('/:id', protect, deleteBudget);

module.exports = router;