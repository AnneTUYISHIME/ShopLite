import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
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
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {loading && <p className="text-[var(--muted)]">Loading...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-[var(--muted)]">You haven't placed any orders yet.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
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
                Total: RWF {order.totalAmount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;