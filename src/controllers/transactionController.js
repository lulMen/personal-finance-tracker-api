const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');
const { resolveCategoryId } = require('./utilityController');

// @desc Get all transactions for the user
// @route GET /transactions
const getTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id });
    if (!req.user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json(transactions)
});

// @desc Get a single transaction by ID
// @route GET /transactions/:id
const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    res.status(200).json(transaction);
});

// @desc Create a new transaction
// @route POST /transactions
const createTransaction = asyncHandler(async (req, res) => {
    const { date, amount, category, description } = req.body;

    if (!date || !amount || !category) {
        res.status(400);
        throw new Error('All fields required');
    }

    let resolvedCategoryId;
    try {
        resolvedCategoryId = await resolveCategoryId(category, req.user._id);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

    const transaction = await Transaction.create({
        user: req.user._id,
        date,
        amount,
        category: resolvedCategoryId,
        description,
    });

    res.status(201).json(transaction);
});

// @desc Update an existing transaction
// @route PUT /transaction/:id
const updateTransaction = asyncHandler(async (req, res) => {

    const transaction = await Transaction.findById(req.params.id);


    if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    if (req.body.category) {
        try {
            transaction.category = await resolveCategoryId(req.body.category, req.user._id);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

    transaction.date = req.body.date || transaction.date;
    transaction.amount = req.body.amount || transaction.amount;
    transaction.description = req.body.description || transaction.description;

    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
});

// @desc Delete a transaction
// @route DELETE /transaction/:id
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    await transaction.deleteOne();
    res.status(200).json({ message: 'Transaction deleted successfully' });
});

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
};