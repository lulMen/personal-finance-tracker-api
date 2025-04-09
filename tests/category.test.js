require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Category = require('../src/models/Category');
const User = require('../src/models/User');

describe('Category Endpoints', () => {
    let token;
    let testUserId;
    let testCategoryId;

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
    });

    afterAll(async () => {
        await Category.deleteMany({ user: testUserId });
        await User.deleteOne({ _id: testUserId });
        await mongoose.connection.close();
    });

    it('POST /categories - should create a new category', async () => {
        const res = await request(app)
            .post('/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Groceries',
                type: 'Expense',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Groceries');
        expect(res.body.type).toBe('expense');
        testCategoryId = res.body._id;
    });

    it('GET /categories - should fetch all categories for the user', async () => {
        const res = await request(app)
            .get('/categories')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});