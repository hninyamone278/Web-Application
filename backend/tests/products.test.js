const request = require('supertest');
const app = require('../app');
const { sequelize, Product, Category, ProductImage } = require('../models');

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  await sequelize.sync({ force: true });

  // Seed test data
  const cat = await Category.create({ name: 'Rings' });
  const p1 = await Product.create({ name: 'Gold Ring', price: 500, stock: 10, category_id: cat.id });
  const p2 = await Product.create({ name: 'Silver Ring', price: 200, stock: 5, category_id: cat.id });
  const p3 = await Product.create({ name: 'Diamond Necklace', price: 1500, stock: 3 });
  await ProductImage.create({ product_id: p1.id, image_url: '/uploads/ring.jpg', sort_order: 1 });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return paginated product list', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('products');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pages');
      expect(res.body.products.length).toBeGreaterThan(0);
    });

    it('should filter products by search query', async () => {
      const res = await request(app).get('/api/products?search=Gold');
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBe(1);
      expect(res.body.products[0].name).toBe('Gold Ring');
    });

    it('should filter products by price range', async () => {
      const res = await request(app).get('/api/products?min_price=400&max_price=600');
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBe(1);
      expect(res.body.products[0].name).toBe('Gold Ring');
    });

    it('should filter products by category', async () => {
      const res = await request(app).get('/api/products?category_id=1');
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBe(2);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product with images', async () => {
      const res = await request(app).get('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Gold Ring');
      expect(res.body.images).toBeDefined();
      expect(res.body.images.length).toBe(1);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/999');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe('GET /api/products/categories', () => {
    it('should return categories', async () => {
      const res = await request(app).get('/api/products/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].name).toBe('Rings');
    });
  });

  describe('GET /api/products/max-price', () => {
    it('should return the maximum price', async () => {
      const res = await request(app).get('/api/products/max-price');
      expect(res.status).toBe(200);
      expect(res.body.maxPrice).toBe(1500);
    });
  });
});
