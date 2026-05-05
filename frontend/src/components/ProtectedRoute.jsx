import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedRoute({ children, adminOnly = false, customerOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  if (customerOnly && user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}
