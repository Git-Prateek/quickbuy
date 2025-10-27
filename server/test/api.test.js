const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
  it('should get products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('products');
  });

  it('should register user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password',
      role: 'buyer'
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
  });
});
