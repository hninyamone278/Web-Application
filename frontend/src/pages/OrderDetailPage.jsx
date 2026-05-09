import {
  Box, Typography, Paper, Chip, Divider, CircularProgress, Button, Alert,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../services/imageUrl';

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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 10, md: 20 } }}><CircularProgress /></Box>;
  if (!order) return <Box sx={{ textAlign: 'center', py: { xs: 10, md: 20 } }}><Typography>Order not found</Typography></Box>;

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 4, md: 8 } }}>
      {searchParams.get('success') && (
        <Alert icon={<CheckCircleOutlineIcon />} severity="success" sx={{ mb: 3 }}>
          Your order has been placed successfully!
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: 'serif', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Order #{order.id}</Typography>
        <Chip label={order.status} color={statusColor[order.status] || 'default'} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
        Placed on {new Date(order.created_at).toLocaleDateString()}
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>Items</Typography>
        {order.items?.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
              <img
                src={getImageUrl(item.product?.image_url)}
                alt={item.product?.name}
                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
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