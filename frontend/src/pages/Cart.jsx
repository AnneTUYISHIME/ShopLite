import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
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
        <div className="max-w-2xl mx-auto px-6 py-10 text-center">
          <p className="text-[var(--muted)] mb-4">Your cart is empty.</p>
          <Link to="/" className="font-medium" style={{ color: 'var(--accent)' }}>
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
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.product.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.imageUrl && (
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
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
                className="w-16 border border-[var(--border)] rounded-lg px-2 py-1.5 text-center"
              />
              <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-6">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>RWF {total.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          {loading ? 'Redirecting to payment...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}

export default Cart;