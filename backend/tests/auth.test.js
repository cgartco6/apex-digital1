const request = require('supertest');
const app = require('../server');
const { User } = require('../models');

describe('Auth', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  test('POST /api/auth/register – success', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'pass123', fullName: 'Test' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
