const Budget = require('../models/Budget');
const asyncHandler = require('express-async-handler');
const { resolveCategoryId } = require('./utilityController');

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
        category,
        amount,
        startDate,
        endDate,
    } = req.body;

    if (!name || !amount || !startDate || !endDate || !category) {
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

    const budget = await Budget.create({
        user: req.user._id,
        name,
        category: resolvedCategoryId,
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
    if (!budget || budget.user.toString() !== req.user._id.toString()) {
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