import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await api.post('/checkout', {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });
      // Redirect the customer to the real Flutterwave payment page
      window.location.href = response.data.paymentLink;
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-3">
          <ShoppingCart size={32} strokeWidth={1.5} className="text-[var(--muted)]" />
          <p className="text-[var(--muted)]">Your cart is empty.</p>
          <Link to="/shop" className="font-medium text-sm" style={{ color: 'var(--accent)' }}>
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Your Cart</h1>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item.product.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                    <Package size={18} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-[var(--muted)]">RWF {item.product.price.toLocaleString()}</p>
              </div>
              <input
                type="number"
                min="1"
                max={item.product.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, Math.max(1, Number(e.target.value)))}
                className="w-16 border border-[var(--border)] rounded-lg px-2 py-1.5 text-center bg-[var(--surface)]"
              />
              <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span style={{ color: 'var(--accent)' }}>RWF {total.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
          style={{ background: 'var(--accent)' }}
        >
          {loading ? 'Redirecting to payment...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}

export default Cart;