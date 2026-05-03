const { Product, ProductImage, Category, Order, OrderItem, User } = require('../models');
const sequelize = require('../config/db');
const { fn, col, literal } = require('sequelize');

// --- Products ---
const adminGetProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'sort_order'] },
      ],
      order: [['created_at', 'DESC'], [{ model: ProductImage, as: 'images' }, 'sort_order', 'ASC']],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const adminCreateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id, images } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });
    const product = await Product.create({ name, description, price, stock, image_url, category_id });
    if (images && Array.isArray(images)) {
      const imageRecords = images.slice(0, 3).map((url, i) => ({
        product_id: product.id,
        image_url: url,
        sort_order: i,
      }));
      await ProductImage.bulkCreate(imageRecords);
    }
    const result = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'sort_order'] },
      ],
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const adminUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { images, ...fields } = req.body;
    await product.update(fields);
    if (images && Array.isArray(images)) {
      await ProductImage.destroy({ where: { product_id: product.id } });
      const imageRecords = images.slice(0, 3).map((url, i) => ({
        product_id: product.id,
        image_url: url,
        sort_order: i,
      }));
      await ProductImage.bulkCreate(imageRecords);
    }
    const result = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'sort_order'] },
      ],
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await ProductImage.destroy({ where: { product_id: product.id } });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// --- Orders ---
const adminGetOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { association: 'items', include: [{ association: 'product', attributes: ['name'] }] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const adminUpdateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { status } = req.body;
    const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    await order.update({ status });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// --- Categories ---
const adminGetCategories = async (req, res) => {
  try {
    const cats = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const adminCreateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const cat = await Category.create({ name });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const adminUploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
};

const adminUploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
};

// --- Report ---
const adminGetReport = async (req, res) => {
  try {
    const topProducts = await OrderItem.findAll({
      attributes: [
        'product_id',
        [fn('SUM', col('quantity')), 'total_sold'],
        [fn('SUM', literal('quantity * unit_price')), 'total_revenue'],
      ],
      include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }],
      group: ['product_id', 'product.id', 'product.name', 'product.image_url'],
      order: [[literal('total_sold'), 'DESC']],
      limit: 10,
    });

    const monthlySales = await Order.findAll({
      attributes: [
        [fn('YEAR', col('created_at')), 'year'],
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('total_amount')), 'revenue'],
        [fn('COUNT', col('id')), 'order_count'],
      ],
      where: { status: { [require('sequelize').Op.ne]: 'Cancelled' } },
      group: [literal('YEAR(created_at)'), literal('MONTH(created_at)')],
      order: [[literal('year'), 'DESC'], [literal('month'), 'DESC']],
      limit: 12,
      raw: true,
    });

    res.json({ topProducts, monthlySales });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetOrders, adminUpdateOrderStatus,
  adminGetCategories, adminCreateCategory,
  adminUploadImage, adminUploadMultipleImages,
  adminGetReport,
};
