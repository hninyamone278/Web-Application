const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const { sequelize, User, Product, Category } = require('../models');

let token;
let token2;
let productId;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  await sequelize.sync({ force: true });

  // Create test user via API
  const res = await request(app).post('/api/auth/register').send({
    name: 'Order User', email: 'order@test.com', password: 'password123',
  });
  token = res.body.token;

  // Create second user
  const res2 = await request(app).post('/api/auth/register').send({
    name: 'Other User', email: 'other@test.com', password: 'password123',
  });
  token2 = res2.body.token;

  // Create test product
  const cat = await Category.create({ name: 'Necklaces' });
  const product = await Product.create({ name: 'Gold Necklace', price: 1000, stock: 5, category_id: cat.id });
  productId = product.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Orders API', () => {
  describe('POST /api/orders', () => {
    it('should create an order and decrement stock', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ product_id: productId, quantity: 2 }],
          shipping_address: '123 Test St',
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('order_id');

      // Verify stock was decremented
      const product = await Product.findByPk(productId);
      expect(product.stock).toBe(3);
    });

    it('should reject order with insufficient stock', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ product_id: productId, quantity: 100 }],
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/insufficient stock/i);
    });

    it('should reject order with no items', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({ items: [] });
      expect(res.status).toBe(400);
    });

    it('should reject order without authentication', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ items: [{ product_id: productId, quantity: 1 }] });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/orders/my', () => {
    it('should return orders for authenticated user', async () => {
      const res = await request(app)
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return empty array for user with no orders', async () => {
      const res = await request(app)
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${token2}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId;

    beforeAll(async () => {
      const res = await request(app)
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${token}`);
      orderId = res.body[0].id;
    });

    it('should return order details for owner', async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(orderId);
      expect(res.body.items).toBeDefined();
    });

    it('should return 404 for other user\'s order', async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token2}`);
      expect(res.status).toBe(404);
    });
  });
});
