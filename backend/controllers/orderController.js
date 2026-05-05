const { Order, OrderItem, Product } = require('../models');

const createOrder = async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    let total_amount = 0;
    const enriched = [];
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) return res.status(404).json({ message: `Product ${item.product_id} not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      total_amount += parseFloat(product.price) * item.quantity;
      enriched.push({ product_id: item.product_id, quantity: item.quantity, unit_price: product.price });
    }
    const order = await Order.create({ user_id: req.user.id, total_amount, shipping_address });
    await OrderItem.bulkCreate(enriched.map((e) => ({ ...e, order_id: order.id })));
    // Decrement stock
    for (const e of enriched) {
      await Product.decrement('stock', { by: e.quantity, where: { id: e.product_id } });
    }
    res.status(201).json({ message: 'Order placed', order_id: order.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ association: 'items', include: [{ association: 'product', attributes: ['name', 'image_url'] }] }],
      order: [['created_at', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ association: 'items', include: [{ association: 'product', attributes: ['name', 'image_url', 'price'] }] }],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrder };
