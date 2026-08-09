import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, PackageSearch, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';
import { useWishlist } from '../hooks/useWishlist';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const { wishlistIds, toggleWishlist } = useWishlist();

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = !activeCategory || p.category === activeCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectCategory = (cat) => {
    if (cat === activeCategory) {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Browse everything on ShopLite in one place.</p>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-3 text-[var(--muted)]" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-sm focus:outline-none focus:ring-2 transition-shadow"
            style={{ '--tw-ring-color': 'color-mix(in srgb, var(--accent) 35%, transparent)' }}
          />
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-7">
            <button
              onClick={() => setSearchParams({})}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={!activeCategory ? { background: 'var(--accent)', color: 'white' } : { border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={activeCategory === cat ? { background: 'var(--accent)', color: 'white' } : { border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-[var(--muted)] py-16 justify-center">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading products...</span>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-[var(--muted)]">
            <PackageSearch size={32} strokeWidth={1.5} />
            <p className="text-sm">No products match your search.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.has(product.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
