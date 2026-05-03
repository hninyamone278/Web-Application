import {
  Box, Typography, Paper, Chip, Divider, CircularProgress, Button, Alert,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const statusColor = { Pending: 'warning', Processing: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'error' };

export default function OrderDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box className="flex justify-center py-20"><CircularProgress /></Box>;
  if (!order) return <Box className="text-center py-20"><Typography>Order not found</Typography></Box>;

  return (
    <Box className="max-w-2xl mx-auto px-4 py-8">
      {searchParams.get('success') && (
        <Alert icon={<CheckCircleOutlineIcon />} severity="success" sx={{ mb: 3 }}>
          Your order has been placed successfully!
        </Alert>
      )}
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" sx={{ fontFamily: 'serif' }}>Order #{order.id}</Typography>
        <Chip label={order.status} color={statusColor[order.status] || 'default'} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Placed on {new Date(order.created_at).toLocaleDateString()}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Items</Typography>
        {order.items?.map((item) => (
          <Box key={item.id} className="flex justify-between items-center py-2">
            <Box className="flex items-center gap-3">
              <img
                src={item.product?.image_url || 'https://placehold.co/50x50?text=J'}
                alt={item.product?.name}
                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
              />
              <Box>
                <Typography variant="body1">{item.product?.name}</Typography>
                <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
              </Box>
            </Box>
            <Typography>{Math.round(parseFloat(item.unit_price) * item.quantity).toLocaleString()} MMK</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1 }} />
        <Box className="flex justify-between">
          <Typography fontWeight="bold">Total</Typography>
          <Typography fontWeight="bold" sx={{ color: '#d4af37' }}>
            {Math.round(parseFloat(order.total_amount)).toLocaleString()} MMK
          </Typography>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Shipping Address</Typography>
        <Typography>{order.shipping_address}</Typography>
      </Paper>

      <Button variant="outlined" onClick={() => navigate('/orders')}>Back to Orders</Button>
    </Box>
  );
}
