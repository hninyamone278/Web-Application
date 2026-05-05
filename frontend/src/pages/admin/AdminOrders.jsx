import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Select, MenuItem, Paper, CircularProgress, TextField, FormControl,
  InputLabel, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const statusColor = { Pending: 'warning', Processing: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'error' };
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus && o.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!o.user?.name?.toLowerCase().includes(q) && !o.user?.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const load = () => {
    api.get('/admin/orders').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  if (loading) return <Box className="flex justify-center py-12"><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Orders ({filteredOrders.length})</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          size="small" placeholder="Search by customer..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell>#{o.id}</TableCell>
                <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Typography variant="body2">{o.user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{o.user?.email}</Typography>
                </TableCell>
                <TableCell>{o.items?.map((i) => i.product?.name).join(', ')}</TableCell>
                <TableCell align="right">{Math.round(parseFloat(o.total_amount)).toLocaleString()} MMK</TableCell>
                <TableCell align="center">
                  <Select
                    size="small" value={o.status} sx={{ minWidth: 120 }}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    renderValue={(v) => <Chip label={v} color={statusColor[v] || 'default'} size="small" />}
                  >
                    {statuses.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
