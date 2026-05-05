import {
  Box, Typography, Chip, Card, CardContent, Grid, Button, CircularProgress, Alert,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const STATUS_COLOR = { pending: 'warning', confirmed: 'success', cancelled: 'error' };

export default function MyAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/appointments/mine')
      .then((r) => setAppointments(r.data))
      .catch(() => setError('Could not load appointments.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="max-w-4xl mx-auto px-4 py-10">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <EventNoteIcon sx={{ color: '#d4af37', fontSize: 36 }} />
        <Typography variant="h4" sx={{ fontFamily: 'serif' }}>My Appointments</Typography>
      </Box>

      {loading && <CircularProgress sx={{ color: '#d4af37', display: 'block', mx: 'auto', mt: 6 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && appointments.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
            You haven't booked any appointments yet.
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#d4af37', color: '#1a1a2e', '&:hover': { bgcolor: '#b8972e' } }}
            onClick={() => navigate('/book-appointment')}
          >
            Book an Appointment
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {appointments.map((a) => (
          <Grid item xs={12} sm={6} key={a.id}>
            <Card elevation={2} sx={{ borderLeft: '4px solid #d4af37', height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{a.purpose}</Typography>
                  <Chip
                    label={a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    color={STATUS_COLOR[a.status] || 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {a.appointment_type} session
                </Typography>
                <Typography variant="body2">
                  📅 {a.appointment_date} &nbsp;&bull;&nbsp; 🕐 {a.time_slot}
                </Typography>
                {a.notes && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    "{a.notes}"
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!loading && appointments.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Button
            variant="outlined"
            sx={{ color: '#d4af37', borderColor: '#d4af37', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
            onClick={() => navigate('/book-appointment')}
          >
            Book Another Appointment
          </Button>
        </Box>
      )}
    </Box>
  );
}
