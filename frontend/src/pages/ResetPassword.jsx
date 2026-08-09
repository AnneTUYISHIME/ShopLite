import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Navbar />
        <div className="max-w-sm mx-auto px-6 py-16">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
              This reset link is missing or invalid. Please request a new one.
            </div>
            <p className="text-sm text-[var(--muted)] mt-6 text-center">
              <Link to="/forgot-password" className="font-medium" style={{ color: 'var(--accent)' }}>
                Request a new link
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-sm mx-auto px-6 py-16">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'color-mix(in srgb, var(--accent) 15%, white)', color: 'var(--accent)' }}
          >
            <ShieldCheck size={20} />
          </div>
          <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

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
              <label className="block text-sm font-medium mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-4 bg-[var(--surface)]"
              />

              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-6 bg-[var(--surface)]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
                style={{ background: 'var(--accent)' }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
