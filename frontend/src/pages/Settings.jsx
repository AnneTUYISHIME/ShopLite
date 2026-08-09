import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Moon, Sun, User, Lock, Loader2, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const ROLE_STYLES = {
  ADMIN: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
  SELLER: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  CUSTOMER: 'bg-green-100 text-green-700 ring-1 ring-green-200',
};

function Settings() {
  const token = localStorage.getItem('token');
  const { theme, toggleTheme } = useTheme();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    api.get('/users/me')
      .then((res) => {
        setProfile(res.data);
        setName(res.data.name);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setSavingProfile(true);
    try {
      const res = await api.put('/users/me', { name });
      setProfile(res.data);
      localStorage.setItem('name', res.data.name);
      setProfileMessage('Profile updated.');
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    clearCart();
    navigate('/');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.put('/users/me/password', { currentPassword, newPassword });
      setPasswordMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Could not change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Manage your account and preferences.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-[var(--muted)] py-10 justify-center">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account info */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <User size={18} style={{ color: 'var(--accent)' }} />
                <h2 className="font-semibold">Account</h2>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <span className="text-sm text-[var(--muted)]">{profile?.email}</span>
                {profile?.role && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_STYLES[profile.role]}`}>
                    {profile.role}
                  </span>
                )}
              </div>

              {profileError && (
                <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
                  {profileError}
                </div>
              )}
              {profileMessage && (
                <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg mb-4 text-sm">
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-4 bg-[var(--surface)]"
                />
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50"
                  style={{ background: 'var(--accent)' }}
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Password */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={18} style={{ color: 'var(--accent)' }} />
                <h2 className="font-semibold">Change Password</h2>
              </div>

              {passwordError && (
                <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
                  {passwordError}
                </div>
              )}
              {passwordMessage && (
                <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg mb-4 text-sm">
                  {passwordMessage}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <label className="block text-sm font-medium mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-4 bg-[var(--surface)]"
                />
                <label className="block text-sm font-medium mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-4 bg-[var(--surface)]"
                />
                <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mb-4 bg-[var(--surface)]"
                />
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50"
                  style={{ background: 'var(--accent)' }}
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Appearance */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                {theme === 'dark' ? <Moon size={18} style={{ color: 'var(--accent)' }} /> : <Sun size={18} style={{ color: 'var(--accent)' }} />}
                <h2 className="font-semibold">Appearance</h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark mode</p>
                  <p className="text-xs text-[var(--muted)]">Switch between light and dark themes.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  role="switch"
                  aria-checked={theme === 'dark'}
                  className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0"
                  style={{ background: theme === 'dark' ? 'var(--accent)' : 'var(--border)' }}
                >
                  <span
                    className="absolute top-1 w-5 h-5 rounded-full bg-white transition-transform shadow"
                    style={{ transform: theme === 'dark' ? 'translateX(22px)' : 'translateX(4px)' }}
                  />
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LogOut size={18} className="text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Log out</p>
                    <p className="text-xs text-[var(--muted)]">Sign out of your ShopLite account on this device.</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
