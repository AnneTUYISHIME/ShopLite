import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
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
            <KeyRound size={20} />
          </div>
          <h1 className="text-2xl font-bold mb-1">Forgot Password</h1>
          <p className="text-sm text-[var(--muted)] mb-6">
            Enter your email and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-6 bg-[var(--surface)]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
                style={{ background: 'var(--accent)' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p className="text-sm text-[var(--muted)] mt-6 text-center">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
