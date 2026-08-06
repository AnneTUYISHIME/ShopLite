import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { items } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
          ShopLite
        </Link>

        <div className="flex items-center gap-5">
          {role === 'ADMIN' && (
            <Link to="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
              Admin
            </Link>
          )}
          {token && (
            <Link to="/orders" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
              My Orders
            </Link>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent)' }}
              >
                {itemCount}
              </span>
            )}
          </Link>

          {token ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted)] flex items-center gap-1">
                <User size={14} /> {name}
              </span>
              <button onClick={handleLogout} className="text-[var(--muted)] hover:text-red-600">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg text-white"
              style={{ background: 'var(--accent)' }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;