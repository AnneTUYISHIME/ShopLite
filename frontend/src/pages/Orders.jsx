import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, PackageSearch, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
  PAID: 'bg-green-100 text-green-800 ring-1 ring-green-200',
  FAILED: 'bg-red-100 text-red-800 ring-1 ring-red-200',
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/me')
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Track everything you've ordered on ShopLite.</p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-[var(--muted)] py-16 justify-center">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-[var(--muted)]">
            <PackageSearch size={32} strokeWidth={1.5} />
            <p className="text-sm">You haven't placed any orders yet.</p>
            <Link to="/shop" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              Start shopping
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                {order.items.map((item, idx) => (
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
                <span className="text-lg" style={{ color: 'var(--accent)' }}>RWF {order.totalAmount.toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
