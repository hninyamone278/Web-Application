const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  appointment_type: {
    type: DataTypes.ENUM('in-store', 'virtual'),
    allowNull: false,
  },
  purpose: { type: DataTypes.STRING, allowNull: false },
  appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
  time_slot: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
  },
}, { tableName: 'appointments', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Appointment;
