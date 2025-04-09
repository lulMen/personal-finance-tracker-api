require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Budget = require('../src/models/Budget');
const User = require('../src/models/User');
const Category = require('../src/models/Category');

describe('Budget Endpoints', () => {
    let token;
    let testUserId;
    let testBudgetId;
    let testCategory;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const res = await request(app).post('/auth/signup').send({
            oauthProvider: 'google',
            oauthToken: process.env.DUMMY_OAUTH_TOKEN,
        });

        token = res.body.token;
        testUserId = res.body._id;

        // Create a test category
        testCategory = await Category.create({
            user: testUserId,
            name: "Groceries", // Must exactly match what the controller expects
            type: "expense"
        });
    });

    afterAll(async () => {
        await Budget.deleteMany({ user: testUserId });
        await Category.deleteMany({ user: testUserId });
        await User.deleteOne({ _id: testUserId });
        await mongoose.connection.close();
    });

    test('POST /budgets - should create a new budget', async () => {
        const res = await request(app)
            .post('/budgets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Budget',
                category: testCategory.name,
                amount: 1000,
                startDate: '2025-04-01',
                endDate: '2025-04-30',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Budget');
        testBudgetId = res.body._id;
    });

    test('GET /budgets - should get all user budgets', async () => {
        const res = await request(app)
            .get('/budgets')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('PUT /budgets/:id - should update an existing budget', async () => {
        const res = await request(app)
            .put(`/budgets/${testBudgetId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated Budget', amount: 1500, startDate: "2025-03-01", endDate: "2025-03-31" });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated Budget');
        expect(res.body.amount).toBe(1500);
    });

    it('DELETE /budgets/:id - should delete a budget', async () => {
        const res = await request(app)
            .delete(`/budgets/${testBudgetId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Budget deleted successfully');
    });
});