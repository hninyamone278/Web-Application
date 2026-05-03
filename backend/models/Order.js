const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Pending',
  },
  shipping_address: { type: DataTypes.TEXT },
}, { tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Order;
