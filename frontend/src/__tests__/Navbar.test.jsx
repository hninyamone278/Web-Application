import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock CartContext
vi.mock('../context/CartContext', () => ({
  useCart: () => ({ cart: [], itemCount: 0, total: 0 }),
}));

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('renders the brand name', () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    renderNavbar();
    expect(screen.getByText('Hnin Ymo Jewellery')).toBeInTheDocument();
  });

  it('shows Login button when not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('shows Shop and Services links when logged in as customer', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: 'Test', role: 'customer' },
      logout: vi.fn(),
    });
    renderNavbar();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('shows Admin Panel button for admin users', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: 'Admin', role: 'admin' },
      logout: vi.fn(),
    });
    renderNavbar();
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.queryByText('Shop')).not.toBeInTheDocument();
  });
});
