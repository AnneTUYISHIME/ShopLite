import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status'); // Flutterwave adds this: successful, cancelled, etc.
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === 'successful') {
      clearCart();
    }
  }, [status]);

  const isSuccess = status === 'successful' || status === 'completed';
  const isCancelled = status === 'cancelled';

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        {isSuccess ? (
          <>
            <CheckCircle size={56} className="mx-auto mb-4 text-green-600" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-[var(--muted)] mb-6">
              Thank you for your order. You can track its status in "My Orders."
            </p>
          </>
        ) : isCancelled ? (
          <>
            <XCircle size={56} className="mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-[var(--muted)] mb-6">You cancelled the payment. Your cart is still saved.</p>
          </>
        ) : (
          <>
            <Clock size={56} className="mx-auto mb-4 text-yellow-600" />
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-[var(--muted)] mb-6">
              We're confirming your payment. Check "My Orders" shortly for the final status.
            </p>
          </>
        )}

        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-5 py-2.5 rounded-lg border border-[var(--border)]">
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="px-5 py-2.5 rounded-lg text-white"
            style={{ background: 'var(--accent)' }}
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;