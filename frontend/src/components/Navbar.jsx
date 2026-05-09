import { AppBar, Toolbar, Typography, IconButton, Badge, Button, Box, Menu, MenuItem, Drawer } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DiamondIcon from '@mui/icons-material/Diamond';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logout();
    handleClose();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1a1a2e' }}>
      <Toolbar sx={{ maxWidth: '100%', width: '100%', px: { xs: 1, sm: 2 } }}>
        <DiamondIcon sx={{ mr: 1, color: '#d4af37', fontSize: { xs: 20, sm: 24 } }} />
        <Typography
          variant="h6"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer', 
            fontFamily: 'serif', 
            color: '#d4af37',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
          onClick={() => navigate('/')}
        >
          Hnin Ymo
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
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

        {/* Mobile Hamburger Button */}
        <IconButton
          color="inherit"
          edge="end"
          onClick={toggleMobileMenu}
          sx={{ display: { xs: 'flex', md: 'none' }, color: '#d4af37' }}
          aria-label="open menu"
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a2e',
            color: '#fff',
            width: 260,
            pt: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
          {/* Close button row */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton onClick={toggleMobileMenu} sx={{ color: '#d4af37' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {user?.role === 'admin' ? (
            <Button
              fullWidth
              variant="outlined"
              sx={{ borderColor: '#d4af37', color: '#d4af37', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
              onClick={() => handleNavigation('/admin')}
            >
              Admin Panel
            </Button>
          ) : (
            <>
              <Button fullWidth sx={{ color: '#fff', justifyContent: 'flex-start' }} onClick={() => handleNavigation('/products')}>Shop</Button>
              <Button fullWidth sx={{ color: '#fff', justifyContent: 'flex-start' }} onClick={() => handleNavigation('/services')}>Services</Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ borderColor: '#d4af37', color: '#d4af37', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}
                onClick={() => handleNavigation('/book-appointment')}
              >
                Book Appointment
              </Button>
              <Button
                fullWidth
                sx={{ color: '#fff', justifyContent: 'flex-start' }}
                startIcon={
                  <Badge badgeContent={itemCount} color="warning">
                    <ShoppingCartIcon />
                  </Badge>
                }
                onClick={() => handleNavigation('/cart')}
              >
                Cart
              </Button>
            </>
          )}

          <Box sx={{ borderTop: '1px solid #333', mt: 1, pt: 1 }}>
            {user ? (
              <>
                <Button fullWidth sx={{ color: '#fff', justifyContent: 'flex-start' }} startIcon={<AccountCircleIcon />} disabled>
                  {user.email || 'Account'}
                </Button>
                {user.role !== 'admin' && (
                  <Button fullWidth sx={{ color: '#fff', justifyContent: 'flex-start' }} onClick={() => handleNavigation('/orders')}>My Orders</Button>
                )}
                {user.role !== 'admin' && (
                  <Button fullWidth sx={{ color: '#fff', justifyContent: 'flex-start' }} onClick={() => handleNavigation('/my-appointments')}>My Appointments</Button>
                )}
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1, borderColor: '#ff6b6b', color: '#ff6b6b', '&:hover': { bgcolor: '#ff6b6b', color: '#fff' } }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: '#d4af37', color: '#1a1a2e', '&:hover': { bgcolor: '#b8963a' } }}
                onClick={() => handleNavigation('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}