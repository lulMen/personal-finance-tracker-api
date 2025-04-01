require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./docs/swagger.json');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const utilityRoutes = require('./routes/utiityRoutes');

const PORT = process.env.PORT || 8080;
const app = express();

app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/auth', authRoutes)
    .use('/transactions', transactionRoutes)
    .use('/budgets', budgetRoutes)
    .use('/oauth2callback', utilityRoutes); // OAuth2 callback route to get tokens

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB using Mongoose');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.log(`Database connection error: ${err.message}`);
        process.exit(1);
    }
};

startServer();