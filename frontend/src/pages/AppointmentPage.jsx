import {
  Box, Typography, Button, TextField, RadioGroup, FormControlLabel, Radio,
  FormControl, FormLabel, Select, MenuItem, InputLabel, Alert, Paper, Divider,
  CircularProgress,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PURPOSES = [
  'Engagement Ring Consultation',
  'Wedding Bands',
  'Gift Selection',
  'Custom Engraving',
  'Jewellery Valuation',
  'General Browsing',
  'Gold Replating',
  'Ring Sizing',
  'Jewellery Cleaning & Polishing',
  'Jewellery Repair',
  'Rhodium Plating',
  'Other',
];

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
];

// Min date: tomorrow
function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function AppointmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledPurpose = searchParams.get('purpose') || '';

  const [form, setForm] = useState({
    appointment_type: 'in-store',
    purpose: PURPOSES.includes(prefilledPurpose) ? prefilledPurpose : '',
    appointment_date: '',
    time_slot: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booked, setBooked] = useState(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.purpose || !form.appointment_date || !form.time_slot) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/appointments', form);
      setBooked(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <Box className="max-w-xl mx-auto px-4 py-16" sx={{ textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 72, color: '#d4af37', mb: 2 }} />
        <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 1 }}>Appointment Requested!</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Your {booked.appointment_type} appointment for <strong>{booked.purpose}</strong> on{' '}
          <strong>{booked.appointment_date}</strong> at <strong>{booked.time_slot}</strong> has been received.
          We'll confirm shortly.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#d4af37', color: '#1a1a2e', '&:hover': { bgcolor: '#b8972e' } }}
            onClick={() => navigate('/my-appointments')}
          >
            View My Appointments
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>Back to Home</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="max-w-2xl mx-auto px-4 py-12">
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <EventAvailableIcon sx={{ fontSize: 52, color: '#d4af37', mb: 1 }} />
        <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 1 }}>Book an Appointment</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Schedule a personal in-store or virtual session with one of our jewellery advisors.
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Appointment type */}
          <FormControl>
            <FormLabel sx={{ color: 'text.primary', fontWeight: 500, mb: 0.5 }}>Session type *</FormLabel>
            <RadioGroup row value={form.appointment_type} onChange={set('appointment_type')}>
              <FormControlLabel value="in-store" control={<Radio sx={{ color: '#d4af37', '&.Mui-checked': { color: '#d4af37' } }} />} label="In-Store" />
              <FormControlLabel value="virtual" control={<Radio sx={{ color: '#d4af37', '&.Mui-checked': { color: '#d4af37' } }} />} label="Virtual" />
            </RadioGroup>
          </FormControl>

          <Divider />

          {/* Purpose */}
          <FormControl fullWidth required>
            <InputLabel>Purpose</InputLabel>
            <Select value={form.purpose} label="Purpose" onChange={set('purpose')}>
              {PURPOSES.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date + Time slot */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Preferred Date"
              type="date"
              value={form.appointment_date}
              onChange={set('appointment_date')}
              inputProps={{ min: tomorrowISO() }}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ flex: 1, minWidth: 180 }}
            />
            <FormControl required sx={{ flex: 1, minWidth: 180 }}>
              <InputLabel>Time Slot</InputLabel>
              <Select value={form.time_slot} label="Time Slot" onChange={set('time_slot')}>
                {TIME_SLOTS.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Notes */}
          <TextField
            label="Additional Notes"
            multiline
            rows={3}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Any specific requests or questions for your advisor..."
          />

          {/* Advisor info */}
          <Box sx={{ bgcolor: '#f9f5ec', borderRadius: 1, p: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Booking as <strong>{user?.name}</strong> ({user?.email})
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ bgcolor: '#d4af37', color: '#1a1a2e', '&:hover': { bgcolor: '#b8972e' } }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#1a1a2e' }} /> : 'Confirm Appointment'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
