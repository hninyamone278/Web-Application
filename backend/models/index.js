const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Appointment = require('./Appointment');

// Associations
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Appointment, { foreignKey: 'user_id', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = { sequelize, User, Category, Product, ProductImage, Order, OrderItem, Appointment };
