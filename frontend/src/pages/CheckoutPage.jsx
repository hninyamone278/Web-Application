import {
  Box, Typography, TextField, Button, Paper, Divider, Alert, CircularProgress, Snackbar,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BANK_INFO = {
  bankName: 'KBZ Bank',
  accountNumber: '0123 4567 8901 2345',
  accountHolder: 'Hnin Ymo',
};

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!user) { navigate('/login'); return null; }
  if (!orderPlaced && cart.length === 0) { navigate('/cart'); return null; }

  const generateInfoText = (info) => {
    const lines = [
      '========================================',
      '        ORDER CONFIRMATION',
      '========================================',
      '',
      `Order ID: #${info.orderId}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      '--- Ordered Items ---',
      ...info.items.map((i) => `  ${i.name}  x${i.quantity}  -  ${Math.round(parseFloat(i.price) * i.quantity).toLocaleString()} MMK`),
      '',
      `Total: ${Math.round(info.total).toLocaleString()} MMK`,
      '',
      '--- Bank Transfer Details ---',
      `Bank: ${BANK_INFO.bankName}`,
      `Account Number: ${BANK_INFO.accountNumber}`,
      `Account Holder: ${BANK_INFO.accountHolder}`,
      '',
      'Please transfer the total amount to the above',
      'bank account within 7 days to confirm your order.',
      '',
      '========================================',
    ];
    return lines.join('\n');
  };

  const handleDownload = () => {
    const text = generateInfoText(orderInfo);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${orderInfo.orderId}-bank-info.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const text = generateInfoText(orderInfo);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) { setError('Shipping address is required'); return; }
    setLoading(true);
    setError('');
    try {
      const itemsSnapshot = cart.map((i) => ({ ...i }));
      const totalSnapshot = total;
      const items = cart.map((i) => ({ product_id: i.id, quantity: i.quantity }));
      const { data } = await api.post('/orders', { items, shipping_address: address });
      clearCart();
      setOrderInfo({ orderId: data.order_id, items: itemsSnapshot, total: totalSnapshot });
      setOrderPlaced(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Order Confirmation View ───
  if (orderPlaced && orderInfo) {
    return (
      <Box className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#4caf50', mb: 1 }} />
          <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 1 }}>Order Placed!</Typography>
          <Typography variant="body1" color="text.secondary">
            Order <strong>#{orderInfo.orderId}</strong> has been placed successfully.
          </Typography>
        </Box>

        {/* Ordered Items */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Items Ordered</Typography>
          {orderInfo.items.map((i) => (
            <Box key={i.id} className="flex justify-between py-1">
              <Typography variant="body2">{i.name} × {i.quantity}</Typography>
              <Typography variant="body2">{Math.round(parseFloat(i.price) * i.quantity).toLocaleString()} MMK</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box className="flex justify-between">
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold" sx={{ color: '#d4af37' }}>{Math.round(orderInfo.total).toLocaleString()} MMK</Typography>
          </Box>
        </Paper>

        {/* Bank Transfer Info */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#fffde7', border: '1px solid #f9a825' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#e65100' }}>
            Bank Transfer Required
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            To confirm your order, please transfer the total amount to the following bank account <strong>within 7 days</strong>.
          </Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: 1, p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="body2"><strong>Bank:</strong> {BANK_INFO.bankName}</Typography>
            <Typography variant="body2"><strong>Account Number:</strong> {BANK_INFO.accountNumber}</Typography>
            <Typography variant="body2"><strong>Account Holder:</strong> {BANK_INFO.accountHolder}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2"><strong>Amount:</strong> {Math.round(orderInfo.total).toLocaleString()} MMK</Typography>
            <Typography variant="body2"><strong>Reference:</strong> Order #{orderInfo.orderId}</Typography>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained" fullWidth startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
          >
            Download as Text File
          </Button>
          <Button
            variant="outlined" fullWidth startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
            sx={{ borderColor: '#1a1a2e', color: '#1a1a2e', '&:hover': { borderColor: '#d4af37', color: '#d4af37' } }}
          >
            Copy to Clipboard
          </Button>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="text" fullWidth
            onClick={() => navigate(`/orders/${orderInfo.orderId}`)}
            sx={{ color: '#1a1a2e' }}
          >
            View Order Details
          </Button>
          <Button
            variant="text" fullWidth
            onClick={() => navigate('/products')}
            sx={{ color: '#1a1a2e' }}
          >
            Continue Shopping
          </Button>
        </Box>

        <Snackbar
          open={copied} autoHideDuration={3000} onClose={() => setCopied(false)}
          message="Order info copied to clipboard!"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    );
  }

  // ─── Checkout Form View ───
  return (
    <Box className="max-w-2xl mx-auto px-4 py-8">
      <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 4 }}>Checkout</Typography>

      {/* Order Summary */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Order Summary</Typography>
        {cart.map((i) => (
          <Box key={i.id} className="flex justify-between py-1">
            <Typography variant="body2">{i.name} × {i.quantity}</Typography>
            <Typography variant="body2">${(parseFloat(i.price) * i.quantity).toFixed(2)}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1 }} />
        <Box className="flex justify-between">
          <Typography fontWeight="bold">Total</Typography>
          <Typography fontWeight="bold" sx={{ color: '#d4af37' }}>{Math.round(total).toLocaleString()} MMK</Typography>
        </Box>
      </Paper>

      {/* Shipping Form */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Shipping Details</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Full Name" value={user.name}
            InputProps={{ readOnly: true }} sx={{ mb: 2 }}
          />
          <TextField
            fullWidth label="Email" value={user.email}
            InputProps={{ readOnly: true }} sx={{ mb: 2 }}
          />
          <TextField
            fullWidth multiline rows={3} label="Shipping Address" required
            value={address} onChange={(e) => setAddress(e.target.value)} sx={{ mb: 3 }}
          />
          <Button
            type="submit" variant="contained" fullWidth size="large" disabled={loading}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
