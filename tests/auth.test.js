// jest.setTimeout(15000);

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Auth Endpoints', () => {
    let token;

    describe('POST /auth/signup', () => {
        it('should create a new dummy user when provided with a dummy token', async () => {
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
        });
    });

    describe('GET /auth/profile', () => {
        it('should retrieve the user profile', async () => {
            const res = await request(app)
                .get('/auth/profile')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjVjYTFhYWZhMzM0MTkxMDhmOWY2MyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ0MTYxMzA2LCJleHAiOjE3NDY3NTMzMDZ9.IKSQqMnKPEjDdJpUKgRNf1cMifTmP51HnGYn3FcmQK4');

            expect(res.statusCode).toEqual(200);
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
