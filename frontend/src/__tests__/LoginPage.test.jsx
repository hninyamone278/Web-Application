import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../pages/LoginPage';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderLogin = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form with email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders the Sign In heading', () => {
    renderLogin();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders a link to Register page', () => {
    renderLogin();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('calls login and navigates on successful submit', async () => {
    mockLogin.mockResolvedValue({ role: 'customer' });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays error message on failed login', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: 'Invalid email or password' } },
    });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });
});
