import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('role', response.data.role);
      clearCart();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-sm mx-auto px-6 py-16">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'color-mix(in srgb, var(--accent) 15%, white)', color: 'var(--accent)' }}
          >
            <LogIn size={20} />
          </div>
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--muted)] mb-6">Log in to your ShopLite account.</p>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-4 bg-[var(--surface)]"
            />

            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-6 bg-[var(--surface)]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
              style={{ background: 'var(--accent)' }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-sm text-[var(--muted)] mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: 'var(--accent)' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
