const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc Get all categories for the authenticated user
// @route GET /categories
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category
        .find({ user: req.user._id })
        .populate('name');

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

    const normalizedType = type.toLowerCase();
    const category = await Category.create({
        user: req.user._id,
        name,
        type: normalizedType,
    });

    res.status(201).json(category);
});

// @desc Update an existing category by ID
// @route PUT /categories/:id
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category || category.user.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Category not found');
    }
    // Update fields if provided
    category.name = req.body.name || category.name;
    if (req.body.type) {
        category.type = req.body.type.toLowerCase();
    }
    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
});

// @desc Delete a category by ID
// @route DELETE /categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category || category.user.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Category not found');
    }
    await category.deleteOne();
    res.status(200).json({ message: 'Category deleted successfully' });
});

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};