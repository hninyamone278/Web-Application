import {
  Box, Typography, TextField, Button, Paper, Alert, CircularProgress, Link,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-[70vh] px-4">
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }} elevation={3}>
        <Typography variant="h5" sx={{ fontFamily: 'serif', mb: 3, textAlign: 'center' }}>
          Sign In
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" name="email" type="email" required
            value={form.email} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" name="password" type="password" required
            value={form.password} onChange={handleChange} sx={{ mb: 3 }} />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#d4af37', color: '#1a1a2e' } }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link component={RouterLink} to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
