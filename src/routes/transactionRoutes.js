const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

// Protected routes
router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransactionById);
router.post('/', protect, createTransaction);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);

module.exports = router;