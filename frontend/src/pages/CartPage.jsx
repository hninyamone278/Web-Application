import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Button, Divider, Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Box className="text-center py-20">
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/products')}
          sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}>
          Shop Now
        </Button>
      </Box>
    );
  }

  return (
    <Box className="max-w-4xl mx-auto px-4 py-8">
      <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 4 }}>Shopping Cart</Typography>
      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <img
                      src={item.image_url || 'https://placehold.co/60x60?text=J'}
                      alt={item.name}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <Typography variant="body1">{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{Math.round(parseFloat(item.price)).toLocaleString()} MMK</TableCell>
                <TableCell align="center">
                  <Box className="flex items-center justify-center gap-1">
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {Math.round(parseFloat(item.price) * item.quantity).toLocaleString()} MMK
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box className="flex justify-between items-center mt-6">
        <Button color="error" onClick={clearCart}>Clear Cart</Button>
        <Box className="text-right">
          <Typography variant="h5" sx={{ mb: 2 }}>
            Total: <strong style={{ color: '#d4af37' }}>{Math.round(total).toLocaleString()} MMK</strong>
          </Typography>
          <Button
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
