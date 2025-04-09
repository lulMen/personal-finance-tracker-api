require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');
const Category = require('../src/models/Category');

describe('Transaction Endpoints', () => {
    let token;
    let testUserId;
    let testCategoryId;
    let testTransactionId;

    beforeAll(async () => {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create a test user manually (bypass OAuth for testing)
        const user = await User.create({
            name: "Test User",
            email: "testuser@example.com",
            oauthProvider: "google",
            role: "user",
        });
        testUserId = user._id;

        // Generate a token for the test user
        token = jwt.sign({ id: testUserId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Create a test category
        const category = await Category.create({
            user: testUserId,
            name: "Groceries",
            type: "expense",
        });
        testCategoryId = category._id;

        // Create an initial test transaction
        const transaction = await Transaction.create({
            user: testUserId,
            category: testCategoryId,
            date: new Date(),
            amount: 100,
            description: "Initial transaction",
        });
        testTransactionId = transaction._id;
    });


    afterAll(async () => {
        await Transaction.deleteMany({ user: testUserId });
        await Category.deleteMany({ user: testUserId });
        await User.deleteOne({ _id: testUserId });
        await mongoose.connection.close();
    });

    test('GET /transactions - should retrieve all transactions for the user', async () => {
        const res = await request(app)
            .get('/transactions')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /transactions/:id - should retrieve a specific transaction by ID', async () => {
        const res = await request(app)
            .get(`/transactions/${testTransactionId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', testTransactionId.toString());
    });

    test('POST /transactions - should create a new transaction', async () => {
        const newTransaction = {
            date: new Date().toISOString(),
            amount: 50,
            category: testCategoryId.toString(),
            description: "Utility Bill"
        };

        const res = await request(app)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(newTransaction);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.amount).toEqual(50);
        expect(res.body.description).toEqual("Utility Bill");
    });

    test('PUT /transactions/:id - should update an existing transaction', async () => {
        const updateData = {
            amount: 200,
            description: "Updated description"
        };

        const res = await request(app)
            .put(`/transactions/${testTransactionId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        expect(res.statusCode).toBe(200);
        expect(res.body.amount).toBe(200);
        expect(res.body.description).toBe("Updated description");
    });

    test('DELETE /transactions/:id - should delete the transaction', async () => {
        const transactionToDelete = await Transaction.create({
            user: testUserId,
            category: testCategoryId,
            date: new Date(),
            amount: 300,
            description: "To be deleted"
        });

        const res = await request(app)
            .delete(`/transactions/${transactionToDelete._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Transaction deleted successfully');
    });
});