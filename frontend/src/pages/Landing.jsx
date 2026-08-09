import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Smartphone, CreditCard, Store, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';
import { useWishlist } from '../hooks/useWishlist';

function Landing() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');
  const { wishlistIds, toggleWishlist } = useWishlist();

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Shop smarter.<br />
            Sell <span style={{ color: 'var(--accent)' }}>faster.</span>
          </h1>
          <p className="text-[var(--muted)] text-lg mb-8 max-w-md">
            A marketplace built for real transactions — pay with Mobile Money or card,
            and get your order confirmed instantly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold"
              style={{ background: 'var(--accent)' }}
            >
              <ShoppingBag size={18} /> Start Shopping
            </Link>
            {!token && (
              <Link
                to="/register?role=SELLER"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-[var(--border)]"
              >
                <Store size={18} /> Sell With Us
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWishlisted={wishlistIds.has(p.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[var(--surface)] border-t border-b border-[var(--border)] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-10 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, white)' }}
              >
                <ShoppingBag size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="font-semibold mb-2">1. Browse & Add to Cart</h3>
              <p className="text-sm text-[var(--muted)]">Explore products from real sellers and pick what you need.</p>
            </div>
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, white)' }}
              >
                <Smartphone size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="font-semibold mb-2">2. Pay with MoMo or Card</h3>
              <p className="text-sm text-[var(--muted)]">Secure checkout via Mobile Money Rwanda or card payment.</p>
            </div>
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, white)' }}
              >
                <CreditCard size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="font-semibold mb-2">3. Get Instant Confirmation</h3>
              <p className="text-sm text-[var(--muted)]">Your order is confirmed the moment payment succeeds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="px-5 py-2.5 rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-sm font-medium"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div
          className="rounded-2xl p-10 text-center text-white"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
        >
          <h2 className="text-2xl font-bold mb-3">Ready to explore the full catalog?</h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg font-semibold mt-4"
            style={{ color: 'var(--accent)' }}
          >
            View All Products <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
        © 2026 ShopLite. All rights reserved.
      </footer>
    </div>
  );
}

export default Landing;