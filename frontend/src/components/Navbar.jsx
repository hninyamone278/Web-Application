import { AppBar, Toolbar, Typography, IconButton, Badge, Button, Box, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DiamondIcon from '@mui/icons-material/Diamond';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1a1a2e' }}>
      <Toolbar className="max-w-7xl mx-auto w-full">
        <DiamondIcon sx={{ mr: 1, color: '#d4af37' }} />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer', fontFamily: 'serif', color: '#d4af37' }}
          onClick={() => navigate('/')}
        >
          Hnin Ymo Jewellery
        </Typography>

        <Box className="flex items-center gap-2">
          {user?.role === 'admin' ? (
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              sx={{ borderColor: '#d4af37', color: '#d4af37', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/products')}>Shop</Button>
              <Button color="inherit" onClick={() => navigate('/services')}>Services</Button>
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                sx={{ borderColor: '#d4af37', color: '#d4af37', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
                onClick={() => navigate('/book-appointment')}
              >
                Book Appointment
              </Button>

              <IconButton color="inherit" onClick={() => navigate('/cart')}>
                <Badge badgeContent={itemCount} color="warning">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </>
          )}

          {user ? (
            <>
              <IconButton color="inherit" onClick={handleMenu}>
                <AccountCircleIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {user.role !== 'admin' && (
                  <MenuItem onClick={() => { navigate('/orders'); handleClose(); }}>My Orders</MenuItem>
                )}
                {user.role !== 'admin' && (
                  <MenuItem onClick={() => { navigate('/my-appointments'); handleClose(); }}>My Appointments</MenuItem>
                )}
                {user.role === 'admin' && (
                  <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}>Admin Panel</MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
