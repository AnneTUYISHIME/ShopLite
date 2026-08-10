import { Link } from 'react-router-dom';
import { ShoppingCart, User, Home, Heart, Settings as SettingsIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { items } = useCart();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{ background: 'var(--navbar-bg)', borderBottom: '1px solid var(--navbar-border)' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="text-xl font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
          ShopLite
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: 'var(--navbar-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--navbar-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navbar-muted)')}
          >
            <Home size={15} /> Home
          </Link>
          <Link
            to="/shop"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--navbar-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--navbar-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navbar-muted)')}
          >
            Shop
          </Link>

          {role === 'SELLER' && (
            <Link
              to="/seller"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--navbar-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--navbar-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navbar-muted)')}
            >
              My Store
            </Link>
          )}
          {role === 'ADMIN' && (
            <Link
              to="/admin"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--navbar-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--navbar-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navbar-muted)')}
            >
              Admin
            </Link>
          )}
          {token && role === 'CUSTOMER' && (
            <Link
              to="/orders"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--navbar-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--navbar-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navbar-muted)')}
            >
              My Orders
            </Link>
          )}

          {role !== 'SELLER' && role !== 'ADMIN' && (
            <Link
              to="/wishlist"
              className="hidden sm:flex transition-colors"
              style={{ color: 'var(--navbar-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navbar-muted)')}
              title="Wishlist"
            >
              <Heart size={19} />
            </Link>
          )}

          {role !== 'SELLER' && role !== 'ADMIN' && (
            <Link
              to="/cart"
              className="relative transition-colors"
              style={{ color: 'var(--navbar-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--navbar-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navbar-muted)')}
            >
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
          )}

          {token ? (
            <Link
              to="/settings"
              className="flex items-center gap-3 transition-colors"
              style={{ color: 'var(--navbar-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--navbar-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navbar-muted)')}
              title="Settings"
            >
              <span className="text-sm flex items-center gap-1">
                <User size={14} /> {name}
              </span>
              <SettingsIcon size={18} />
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg text-white shadow-sm hover:brightness-110 transition-all"
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