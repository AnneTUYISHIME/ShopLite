import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

function Wishlist() {
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get('/wishlist')
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleToggle = async (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await api.delete(`/wishlist/${productId}`);
    } catch {
      // If it fails, refetch to get back in sync.
      api.get('/wishlist').then((res) => setProducts(res.data)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Products you've saved for later.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-[var(--muted)] py-16 justify-center">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-[var(--muted)]">
            <Heart size={32} strokeWidth={1.5} />
            <p className="text-sm">Nothing saved yet.</p>
            <Link to="/shop" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={true}
                onToggleWishlist={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
