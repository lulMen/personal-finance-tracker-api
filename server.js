const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB using Mongoose');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

startServer();