const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateStatus,
} = require('../controllers/appointmentController');

router.post('/', protect, createAppointment);
router.get('/mine', protect, getMyAppointments);
router.get('/', protect, adminOnly, getAllAppointments);
router.patch('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;
