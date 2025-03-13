const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const PORT = process.env.PORT || 8080;
const app = express();

app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const startServer = async () => {
    try {
        // await mongoose.connect(process.env.MONGO_URI);
        // console.log('Connected to MongoDB using Mongoose');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.log(`Database connection error: ${err.message}`);
        process.exit(1);
    }
};

startServer();