const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
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
    description: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);