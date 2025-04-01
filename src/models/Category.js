const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: [
            'Food',
            'Transport',
            'Shopping',
            'Bills',
            'Entertainment',
            'Other',
        ],
        required: true,
    },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;