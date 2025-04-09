const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }],
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;