const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc Get all categories for the authenticated user
// @route GET /categories
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category
        .find({ user: req.user._id })
        .populate('categories');

    res.status(200).json(categories);
});

// @desc Create a new category for the authenticated user
// @route POST /categories
const createCategory = asyncHandler(async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        res.status(400);
        throw new Error('All fields required');
    }

    const categoryExists = await Category.findOne({ name, user: req.user._id });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({
        user: req.user._id,
        name,
        type,
    });

    res.status(201).json(category);
});

module.exports = {
    getCategories,
    createCategory,
};