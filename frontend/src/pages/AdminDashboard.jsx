import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Package, ClipboardList, Trash2, ShieldOff, ShieldCheck, Store, Loader2, Inbox } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const ROLE_STYLES = {
  ADMIN: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
  SELLER: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  CUSTOMER: 'bg-green-100 text-green-700 ring-1 ring-green-200',
};

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
  PAID: 'bg-green-100 text-green-800 ring-1 ring-green-200',
  FAILED: 'bg-red-100 text-red-800 ring-1 ring-red-200',
};

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

const AVATAR_COLORS = [
  'bg-orange-100 text-orange-700',
  'bg-blue-100 text-blue-700',
  'bg-teal-100 text-teal-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-amber-100 text-amber-700',
];

const avatarColor = (seed = '') => {
  const code = seed.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-[var(--muted)]">
      <Inbox size={28} strokeWidth={1.5} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function AdminDashboard() {
  const role = localStorage.getItem('role');
  const [tab, setTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users').then((res) => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then((res) => setProducts(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  const fetchOrders = () => {
    setLoading(true);
    api.get('/admin/orders').then((res) => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    else if (tab === 'products') fetchProducts();
    else fetchOrders();
  }, [tab]);

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const toggleUserStatus = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/status`, { enabled: !user.enabled });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, enabled: !u.enabled } : u)));
    } catch (err) {
      setMessage('Failed to update user status');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Remove this product listing?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setMessage('Failed to remove product');
    }
  };

  const sellerCount = users.filter((u) => u.role === 'SELLER').length;
  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length;

  const TABS = [
    { key: 'users', label: 'Users', icon: Users },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Platform Oversight</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Manage users, products, and orders across ShopLite.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-blue-50" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Store size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 leading-tight">{sellerCount}</p>
                <p className="text-xs text-[var(--muted)]">Sellers</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-green-50" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Users size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 leading-tight">{customerCount}</p>
                <p className="text-xs text-[var(--muted)]">Customers</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full" style={{ background: 'color-mix(in srgb, var(--accent) 12%, white)' }} />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--accent) 15%, white)', color: 'var(--accent)' }}>
                <Package size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold leading-tight" style={{ color: 'var(--accent)' }}>{products.length || '—'}</p>
                <p className="text-xs text-[var(--muted)]">Products Listed</p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <div className="flex gap-2 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-full p-1.5 w-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
              style={
                tab === key
                  ? { background: 'var(--accent)', color: 'white', boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent)' }
                  : { color: 'var(--muted)' }
              }
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-[var(--muted)] py-10 justify-center">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}

        {!loading && tab === 'users' && (
          users.length === 0 ? (
            <EmptyState label="No users yet." />
          ) : (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
              {users.map((u) => (
                <div key={u.id} className="flex justify-between items-center p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${avatarColor(u.email)}`}>
                      {initials(u.name) || '?'}
                    </div>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-[var(--muted)]">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.enabled ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 'bg-gray-200 text-gray-600 ring-1 ring-gray-300'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => toggleUserStatus(u)}
                        title={u.enabled ? 'Disable account' : 'Enable account'}
                        className={u.enabled ? 'text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors' : 'text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors'}
                      >
                        {u.enabled ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {!loading && tab === 'products' && (
          products.length === 0 ? (
            <EmptyState label="No products listed yet." />
          ) : (
            <div className="space-y-8">
              {Object.entries(
                products.reduce((categoryGroups, p) => {
                  const category = p.category || 'Uncategorized';
                  (categoryGroups[category] = categoryGroups[category] || []).push(p);
                  return categoryGroups;
                }, {})
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([categoryName, categoryProducts]) => (
                  <div key={categoryName}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <h2 className="text-base font-bold tracking-tight">{categoryName}</h2>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'color-mix(in srgb, var(--accent) 15%, white)', color: 'var(--accent)' }}
                      >
                        {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-5 pl-4 border-l-2" style={{ borderColor: 'color-mix(in srgb, var(--accent) 25%, var(--border))' }}>
                      {Object.entries(
                        categoryProducts.reduce((sellerGroups, p) => {
                          const seller = p.sellerName || 'Unknown Seller';
                          (sellerGroups[seller] = sellerGroups[seller] || []).push(p);
                          return sellerGroups;
                        }, {})
                      )
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([sellerName, sellerProducts]) => (
                          <div key={sellerName}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${avatarColor(sellerName)}`}>
                                {initials(sellerName) || '?'}
                              </div>
                              <h3 className="text-sm font-semibold text-[var(--muted)]">
                                {sellerName} · {sellerProducts.length} product{sellerProducts.length !== 1 ? 's' : ''}
                              </h3>
                            </div>
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                              {sellerProducts.map((p) => (
                                <div key={p.id} className="flex justify-between items-center p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors group">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                                      {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                                          <Package size={16} />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium">{p.name}</p>
                                      <p className="text-sm text-[var(--muted)]">RWF {p.price.toLocaleString()} · {p.stock} in stock</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => deleteProduct(p.id)}
                                    title="Remove product"
                                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )
        )}

        {!loading && tab === 'orders' && (
          orders.length === 0 ? (
            <EmptyState label="No orders yet." />
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${avatarColor(o.buyerEmail)}`}>
                        {initials(o.buyerName) || '?'}
                      </div>
                      <div>
                        <p className="font-semibold">Order #{o.id} — {o.buyerName}</p>
                        <p className="text-sm text-[var(--muted)]">{o.buyerEmail}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                          {item.productImageUrl ? (
                            <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={14} />
                            </div>
                          )}
                        </div>
                        <p>
                          {item.productName} × {item.quantity} — RWF {(item.priceAtPurchase * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="font-bold mt-3 pt-3 border-t border-[var(--border)] flex justify-between items-baseline">
                    <span className="text-sm font-medium text-[var(--muted)]">Total</span>
                    <span className="text-lg" style={{ color: 'var(--accent)' }}>RWF {o.totalAmount.toLocaleString()}</span>
                  </p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
