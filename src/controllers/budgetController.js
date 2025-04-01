const Budget = require('../models/Budget');
// const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');

// @desc Get all budgets for a user
// @route GET /budgets
const getBudgets = asyncHandler(async (req, res) => {
    const budgets = await Budget
        .find({ user: req.user._id })
        .populate('transactions');

    res.status(200).json(budgets);
});

// @desc Create a new budget
// @route POST /budgets
const createBudget = asyncHandler(async (req, res) => {
    const {
        name,
        amount,
        startDate,
        endDate,
    } = req.body;

    if (!name || !amount || !startDate || !endDate) {
        res.status(400);
        throw new Error('All fields required');
    }

    const budget = await Budget.create({
        user: req.user._id,
        name,
        amount,
        startDate,
        endDate,
        transactions: [],
    });

    res.status(201).json(budget);
});

// @desc Update an existing budget
// @route PUT /budgets/:id
const updateBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.user.toString() !== req.user._id_.toString()) {
        res.status(404);
        throw new Error('Budget not found');
    }

    budget.name = req.body.name || budget.name;
    budget.amount = req.body.amount || budget.amount;
    budget.startDate = req.body.startDate || budget.startDate;
    budget.endDate = req.body.endDate || budget.endDate;

    const updatedBudget = await budget.save();
    res.status(200).json(updatedBudget);
});

// @desc Delete an existing budget
// @route DELETE /budgets/:id
const deleteBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.user.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Budget not found');
    }

    await budget.deleteOne();
    res.status(200).json({ message: 'Budget deleted successfully' });
});

module.exports = {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
};