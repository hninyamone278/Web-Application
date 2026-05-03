import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AppointmentPage from './pages/AppointmentPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import ServicesPage from './pages/ServicesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/checkout" element={
                  <ProtectedRoute customerOnly><CheckoutPage /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute customerOnly><OrdersPage /></ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute customerOnly><OrderDetailPage /></ProtectedRoute>
                } />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/book-appointment" element={
                  <ProtectedRoute customerOnly><AppointmentPage /></ProtectedRoute>
                } />
                <Route path="/my-appointments" element={
                  <ProtectedRoute customerOnly><MyAppointmentsPage /></ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                  <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
                } />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
