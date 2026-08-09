import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function Register() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') === 'SELLER' ? 'SELLER' : 'CUSTOMER';

  const [name, setName] = useState('');
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
      await api.post('/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-sm mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-2">
          {role === 'SELLER' ? 'Become a Seller' : 'Create Account'}
        </h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          {role === 'SELLER'
            ? "You're signing up to sell products on ShopLite."
            : "You're signing up to shop on ShopLite."}
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-4"
          />

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
            minLength={6}
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-[var(--muted)] mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;