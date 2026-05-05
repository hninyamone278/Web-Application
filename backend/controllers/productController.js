const { Op } = require('sequelize');
const { Product, Category, ProductImage } = require('../models');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { search, category_id, min_price, max_price, page = 1, limit = 12 } = req.query;
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category_id) where.category_id = category_id;
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = parseFloat(min_price);
      if (max_price) where.price[Op.lte] = parseFloat(max_price);
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const count = await Product.count({ where });
    const rows = await Product.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'sort_order'] },
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC'], [{ model: ProductImage, as: 'images' }, 'sort_order', 'ASC']],
    });
    res.json({ total: count, page: parseInt(page), pages: Math.ceil(count / limit), products: rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'sort_order'] },
      ],
      order: [[{ model: ProductImage, as: 'images' }, 'sort_order', 'ASC']],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMaxPrice = async (req, res) => {
  try {
    const result = await Product.max('price');
    res.json({ maxPrice: Math.ceil(parseFloat(result || 0)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProducts, getProduct, getCategories, getMaxPrice };
