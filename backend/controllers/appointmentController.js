const { Appointment, User } = require('../models');

const createAppointment = async (req, res) => {
  try {
    const { appointment_type, purpose, appointment_date, time_slot, notes } = req.body;
    if (!appointment_type || !purpose || !appointment_date || !time_slot) {
      return res.status(400).json({ message: 'appointment_type, purpose, appointment_date and time_slot are required' });
    }
    const appointment = await Appointment.create({
      user_id: req.user.id,
      appointment_type,
      purpose,
      appointment_date,
      time_slot,
      notes: notes || null,
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { user_id: req.user.id },
      order: [['appointment_date', 'DESC'], ['created_at', 'DESC']],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['appointment_date', 'ASC'], ['time_slot', 'ASC']],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createAppointment, getMyAppointments, getAllAppointments, updateStatus };
