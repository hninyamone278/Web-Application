const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models');

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  const testUser = { name: 'Test User', email: 'test@example.com', password: 'password123' };

  describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.name).toBe(testUser.name);
      expect(res.body.user.role).toBe('customer');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already registered/i);
    });

    it('should reject when fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/required/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should reject wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should reject missing fields', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: testUser.email });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/required/i);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeAll(async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      token = res.body.token;
    });

    it('should return current user when authenticated', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body).not.toHaveProperty('password_hash');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');
      expect(res.status).toBe(401);
    });
  });
});
