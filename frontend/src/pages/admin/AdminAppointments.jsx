import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Select, MenuItem, CircularProgress, Alert, TextField, FormControl,
  InputLabel, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const STATUS_COLOR = { pending: 'warning', confirmed: 'success', cancelled: 'error' };

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterType && a.appointment_type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!a.user?.name?.toLowerCase().includes(q) && !a.purpose?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  useEffect(() => {
    api.get('/appointments')
      .then((r) => setAppointments(r.data))
      .catch(() => setError('Could not load appointments.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: data.status } : a)));
    } catch {
      // silently ignore — UI stays consistent
    }
  };

  if (loading) return <CircularProgress sx={{ color: '#d4af37', display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>
        Appointments ({filteredAppointments.length})
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          size="small" placeholder="Search by name or purpose..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="in-store">In-Store</MenuItem>
            <MenuItem value="virtual">Virtual</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredAppointments.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No appointments found.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#1a1a2e' }}>
              <TableRow>
                {['ID', 'Customer', 'Type', 'Purpose', 'Date', 'Time', 'Notes', 'Status'].map((h) => (
                  <TableCell key={h} sx={{ color: '#d4af37', fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{a.user?.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.user?.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{a.appointment_type}</TableCell>
                  <TableCell>{a.purpose}</TableCell>
                  <TableCell>{a.appointment_date}</TableCell>
                  <TableCell>{a.time_slot}</TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <Typography variant="caption" noWrap title={a.notes}>{a.notes || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={a.status}
                      size="small"
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      renderValue={(v) => (
                        <Chip
                          label={v.charAt(0).toUpperCase() + v.slice(1)}
                          color={STATUS_COLOR[v] || 'default'}
                          size="small"
                        />
                      )}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
