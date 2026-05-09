import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, CircularProgress, Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const statusColor = { Pending: 'warning', Processing: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'error' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders/my').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 10, md: 20 } }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 4, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>My Orders</Typography>
      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
          <Typography variant="h6" gutterBottom>No orders yet</Typography>
          <Button variant="contained" onClick={() => navigate('/products')}
            sx={{ bgcolor: '#1a1a2e', mt: 2, '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}>
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Order #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell>#{o.id}</TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{o.items?.length || 0} item(s)</TableCell>
                  <TableCell align="right">{Math.round(parseFloat(o.total_amount)).toLocaleString()} MMK</TableCell>
                  <TableCell align="center">
                    <Chip label={o.status} color={statusColor[o.status] || 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => navigate(`/orders/${o.id}`)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
