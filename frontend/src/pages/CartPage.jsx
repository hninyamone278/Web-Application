import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Button, Divider, Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/imageUrl';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: { xs: 12, md: 20 }, px: 2 }}>
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/products')}
          sx={{ bgcolor: '#1a1a2e', mt: 2, '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}>
          Shop Now
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 4, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' } }}>Shopping Cart</Typography>
      
      {/* Desktop Table View */}
      <Paper variant="outlined" sx={{ display: { xs: 'none', sm: 'block' }, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Product</TableCell>
              <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Price</TableCell>
              <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Qty</TableCell>
              <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Subtotal</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right"><Typography variant="body2">{Math.round(parseFloat(item.price)).toLocaleString()} MMK</Typography></TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right"><Typography variant="body2">{Math.round(parseFloat(item.price) * item.quantity).toLocaleString()} MMK</Typography></TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        {cart.map((item) => (
          <Paper key={item.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <img
                src={getImageUrl(item.image_url)}
                alt={item.name}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight="bold">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">{Math.round(parseFloat(item.price)).toLocaleString()} MMK</Typography>
              </Box>
              <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography fontWeight="bold">{Math.round(parseFloat(item.price) * item.quantity).toLocaleString()} MMK</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mt: 4 }}>
        <Button color="error" variant="outlined" onClick={clearCart} sx={{ order: { xs: 2, sm: 1 } }}>Clear Cart</Button>
        <Box sx={{ textAlign: { xs: 'center', sm: 'right' }, order: { xs: 1, sm: 2 } }}>
          <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Total: <strong style={{ color: '#d4af37' }}>{Math.round(total).toLocaleString()} MMK</strong>
          </Typography>
          <Button
            fullWidth
            variant="contained" size="large"
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
}