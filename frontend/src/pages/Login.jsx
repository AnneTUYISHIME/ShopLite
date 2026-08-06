import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('role', response.data.role);
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
        <h1 className="text-2xl font-bold mb-6">Log In</h1>

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
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-4"
          />

          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50"
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
  );
}

export default Login;