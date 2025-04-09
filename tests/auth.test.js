require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');

describe('Auth Endpoints', () => {
    let token;
    let testUserId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await User.deleteMany({ email: 'dummy@example.com' });
        await mongoose.connection.close();
    });


    test('POST /auth/signup - should create a new dummy user when provided with a dummy token', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                oauthProvider: 'google',
                oauthToken: process.env.DUMMY_OAUTH_TOKEN || 'TEST123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toEqual('dummy@example.com');

        token = res.body.token;
        testUserId = res.body._id;
    });

    test('GET /auth/profile - should retrieve the authenticated user profile', async () => {
        const res = await request(app)
            .get('/auth/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', 'dummy@example.com');
    });

    test('should update the authenticated user profile', async () => {
        const updateData = {
            name: 'Updated Dummy User',
            email: 'updated_dummy@example.com'
        };

        const res = await request(app)
            .put('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Updated Dummy User');
        expect(res.body).toHaveProperty('email', 'updated_dummy@example.com');

        token = res.body.token;
    });

    test('should delete the authenticated user account', async () => {
        const res = await request(app)
            .delete('/auth/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User account deleted successfully');
    });

    test('POST /auth/login - should authenticate dummy user with valid OAuth credentials', async () => {
        // Create a test user manually (bypass OAuth for testing)
        const user = await User.create({
            name: "Dummy User",
            email: "dummy@example.com",
            oauthProvider: "google",
            role: "user",
        });
        testUserId = user._id;

        // Generate a token for the test user
        token = jwt.sign({ id: testUserId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const res = await request(app)
            .post('/auth/login')
            .send({
                oauthProvider: 'google',
                oauthToken: process.env.DUMMY_OAUTH_TOKEN || 'TEST123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toEqual('dummy@example.com');
    });

    test('GET /auth/logout - should respond with a logout success message', async () => {
        const res = await request(app)
            .get('/auth/logout')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User logged out successfully');
    });
});