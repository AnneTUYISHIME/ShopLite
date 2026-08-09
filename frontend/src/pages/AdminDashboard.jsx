import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Package, ClipboardList, Trash2, ShieldOff, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const ROLE_STYLES = {
  ADMIN: 'bg-purple-100 text-purple-700',
  SELLER: 'bg-blue-100 text-blue-700',
  CUSTOMER: 'bg-green-100 text-green-700',
};

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

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

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Platform Oversight</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-600">{sellerCount}</p>
            <p className="text-xs text-[var(--muted)]">Sellers</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-2xl font-bold text-green-600">{customerCount}</p>
            <p className="text-xs text-[var(--muted)]">Customers</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{products.length || '—'}</p>
            <p className="text-xs text-[var(--muted)]">Products Listed</p>
          </div>
        </div>

        {message && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('users')} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={tab === 'users' ? { background: 'var(--accent)', color: 'white' } : { background: 'white', border: '1px solid var(--border)' }}>
            <Users size={16} /> Users
          </button>
          <button onClick={() => setTab('products')} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={tab === 'products' ? { background: 'var(--accent)', color: 'white' } : { background: 'white', border: '1px solid var(--border)' }}>
            <Package size={16} /> Products
          </button>
          <button onClick={() => setTab('orders')} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={tab === 'orders' ? { background: 'var(--accent)', color: 'white' } : { background: 'white', border: '1px solid var(--border)' }}>
            <ClipboardList size={16} /> Orders
          </button>
        </div>

        {loading && <p className="text-[var(--muted)]">Loading...</p>}

        {!loading && tab === 'users' && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
            {users.map((u) => (
              <div key={u.id} className="flex justify-between items-center p-4 border-b border-[var(--border)] last:border-0">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-[var(--muted)]">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {u.enabled ? 'Active' : 'Disabled'}
                  </span>
                  {u.role !== 'ADMIN' && (
                    <button onClick={() => toggleUserStatus(u)} className={u.enabled ? 'text-red-600 hover:bg-red-50 p-2 rounded-lg' : 'text-green-600 hover:bg-green-50 p-2 rounded-lg'}>
                      {u.enabled ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'products' && (
          <div className="space-y-6">
            {Object.entries(
              products.reduce((groups, p) => {
                const seller = p.sellerName || 'Unknown Seller';
                (groups[seller] = groups[seller] || []).push(p);
                return groups;
              }, {})
            )
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([sellerName, sellerProducts]) => (
                <div key={sellerName}>
                  <h3 className="text-sm font-semibold text-[var(--muted)] mb-2">
                    {sellerName} · {sellerProducts.length} product{sellerProducts.length !== 1 ? 's' : ''}
                  </h3>
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
                    {sellerProducts.map((p) => (
                      <div key={p.id} className="flex justify-between items-center p-4 border-b border-[var(--border)] last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-[var(--muted)]">RWF {p.price.toLocaleString()} · {p.stock} in stock</p>
                          </div>
                        </div>
                        <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {!loading && tab === 'orders' && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-medium">Order #{o.id} — {o.buyerName}</p>
                    <p className="text-sm text-[var(--muted)]">{o.buyerEmail}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                </div>

                <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.productImageUrl && (
                          <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <p>
                        {item.productName} × {item.quantity} — RWF {(item.priceAtPurchase * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="font-bold mt-3 pt-3 border-t border-[var(--border)]">
                  Total: RWF {o.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;